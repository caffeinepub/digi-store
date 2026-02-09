import Map "mo:core/Map";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Stripe "stripe/stripe";
import OutCall "http-outcalls/outcall";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";



actor {
  // Include storage and authorization
  include MixinStorage();
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Data Types
  public type DigitalDownload = {
    downloadFile : Storage.ExternalBlob;
    contentType : Text;
    fileSizeBytes : Nat;
    downloadLimit : ?Nat;
  };

  public type Product = {
    id : Text;
    name : Text;
    description : Text;
    priceCents : Nat;
    category : Text;
    featured : Bool;
    images : [Storage.ExternalBlob];
    createdAt : Time.Time;
    digitalDownload : ?DigitalDownload;
  };

  public type Category = {
    id : Text;
    name : Text;
    description : Text;
  };

  public type BrandStory = {
    title : Text;
    content : Text;
    heroImage : ?Storage.ExternalBlob;
  };

  public type HomepageContent = {
    heroBanner : {
      title : Text;
      subtitle : Text;
      backgroundImage : ?Storage.ExternalBlob;
    };
    featuredProducts : [Product];
    brandStory : BrandStory;
  };

  public type UserProfile = {
    name : Text;
  };

  public type DigitalPurchase = {
    user : Principal;
    productId : Text;
    purchaseTimestamp : Time.Time;
    allowedDownloads : Nat;
    downloadCount : Nat;
  };

  // Persistent Data Stores
  var products = Map.empty<Text, Product>();
  var brandStory : ?BrandStory = null;
  let persistentCategories = Map.empty<Text, Category>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  var persistentHeroBanner : ?{
    title : Text;
    subtitle : Text;
    backgroundImage : ?Storage.ExternalBlob;
  } = null;
  let digitalPurchases = Map.empty<Text, [DigitalPurchase]>();

  // Stripe Integration State
  var stripeConfiguration : ?Stripe.StripeConfiguration = null;

  // Helper Functions
  func getAllProducts() : [Product] {
    products.values().toArray();
  };

  func getProductsByCategory(category : Text) : [Product] {
    products.values().toArray().filter(func(p) { p.category == category });
  };

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Product Management
  public query ({ caller }) func getProducts() : async [Product] {
    products.values().toArray();
  };

  public query ({ caller }) func getProduct(productId : Text) : async Product {
    switch (products.get(productId)) {
      case (null) { Runtime.trap("Product does not exist") };
      case (?product) { product };
    };
  };

  public shared ({ caller }) func addProduct(product : Product) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add products");
    };
    products.add(product.id, product);
  };

  public shared ({ caller }) func updateProduct(product : Product) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update products");
    };
    products.add(product.id, product);
  };

  public shared ({ caller }) func deleteProduct(productId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete products");
    };
    products.remove(productId);
  };

  public shared ({ caller }) func setProductImages(productId : Text, images : [Storage.ExternalBlob]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update product images");
    };
    switch (products.get(productId)) {
      case (null) { Runtime.trap("Product does not exist") };
      case (?product) {
        let updatedProduct : Product = {
          id = product.id;
          name = product.name;
          description = product.description;
          priceCents = product.priceCents;
          category = product.category;
          featured = product.featured;
          images;
          createdAt = product.createdAt;
          digitalDownload = product.digitalDownload;
        };
        products.add(productId, updatedProduct);
      };
    };
  };

  // Digital Downloads Management
  public shared ({ caller }) func setDigitalDownload(productId : Text, download : DigitalDownload) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can set digital downloads");
    };
    switch (products.get(productId)) {
      case (null) { Runtime.trap("Product does not exist") };
      case (?product) {
        let updatedProduct : Product = { product with digitalDownload = ?download };
        products.add(productId, updatedProduct);
      };
    };
  };

  public shared ({ caller }) func removeDigitalDownload(productId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can remove digital downloads");
    };
    switch (products.get(productId)) {
      case (null) { Runtime.trap("Product does not exist") };
      case (?product) {
        let updatedProduct : Product = { product with digitalDownload = null };
        products.add(productId, updatedProduct);
      };
    };
  };

  public shared ({ caller }) func recordDigitalPurchase(productId : Text, allowedDownloads : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can record purchases");
    };

    switch (products.get(productId)) {
      case (null) { Runtime.trap("Product does not exist") };
      case (?product) {
        if (product.digitalDownload == null) {
          Runtime.trap("Product does not have a digital download");
        };
        let purchase : DigitalPurchase = {
          user = caller;
          productId;
          purchaseTimestamp = Time.now();
          allowedDownloads;
          downloadCount = 0;
        };
        let userPurchases = switch (digitalPurchases.get(caller.toText())) {
          case (null) { [] };
          case (?purchases) { purchases };
        };
        digitalPurchases.add(caller.toText(), userPurchases.concat([purchase]));
      };
    };
  };

  public query ({ caller }) func getUserDigitalPurchases() : async [DigitalPurchase] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view their purchases");
    };
    switch (digitalPurchases.get(caller.toText())) {
      case (null) { [] };
      case (?purchases) { purchases };
    };
  };

  // Category Management
  public query ({ caller }) func getCategories() : async [Category] {
    persistentCategories.values().toArray();
  };

  public shared ({ caller }) func addCategory(category : Category) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add categories");
    };
    persistentCategories.add(category.id, category);
  };

  public shared ({ caller }) func updateCategory(category : Category) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update categories");
    };
    persistentCategories.add(category.id, category);
  };

  // Brand Story & Homepage Content
  public query ({ caller }) func getBrandStory() : async ?BrandStory {
    brandStory;
  };

  public shared ({ caller }) func setBrandStory(story : BrandStory) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can set brand story");
    };
    brandStory := ?story;
  };

  public query ({ caller }) func getHeroBanner() : async ?{
    title : Text;
    subtitle : Text;
    backgroundImage : ?Storage.ExternalBlob;
  } {
    persistentHeroBanner;
  };

  public shared ({ caller }) func setHeroBanner(banner : {
    title : Text;
    subtitle : Text;
    backgroundImage : ?Storage.ExternalBlob;
  }) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can set hero banner");
    };
    persistentHeroBanner := ?banner;
  };

  public query ({ caller }) func getFeaturedProducts() : async [Product] {
    products.values().toArray().filter(func(p) { p.featured });
  };

  public query ({ caller }) func getHomepageContent() : async HomepageContent {
    let heroBanner = switch (persistentHeroBanner) {
      case (null) { Runtime.trap("Hero banner not set") };
      case (?banner) { banner };
    };

    let featuredProducts = products.values().toArray().filter(func(p) { p.featured });

    let homepageBrandStory = switch (brandStory) {
      case (null) { Runtime.trap("Brand story not set") };
      case (?story) { story };
    };

    {
      heroBanner;
      featuredProducts;
      brandStory = homepageBrandStory;
    };
  };

  // Stripe Integration Methods
  public query func isStripeConfigured() : async Bool {
    stripeConfiguration != null;
  };

  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    stripeConfiguration := ?config;
  };

  func getStripeConfiguration() : Stripe.StripeConfiguration {
    switch (stripeConfiguration) {
      case (null) { Runtime.trap("Stripe needs to be first configured") };
      case (?value) { value };
    };
  };

  public shared ({ caller }) func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can check session status");
    };
    await Stripe.getSessionStatus(getStripeConfiguration(), sessionId, transform);
  };

  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can create checkout sessions");
    };
    await Stripe.createCheckoutSession(getStripeConfiguration(), caller, items, successUrl, cancelUrl, transform);
  };

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  // Site Branding
  public query ({ caller }) func getSiteBranding() : async {
    name : Text;
    theme : Text;
  } {
    {
      name = "Digi Store";
      theme = "vibrant";
    };
  };
};
