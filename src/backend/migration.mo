import Map "mo:core/Map";
import Text "mo:core/Text";

module {
  // Old types (for migration reference only)
  type OldProduct = {
    id : Text;
    name : Text;
    description : Text;
    priceCents : Nat;
    category : Text;
    featured : Bool;
    images : [Blob];
    createdAt : Int;
  };

  type OldActor = {
    products : Map.Map<Text, OldProduct>;
  };

  // New types (for migration reference only)
  type NewDigitalDownload = {
    downloadFile : Blob;
    contentType : Text;
    fileSizeBytes : Nat;
    downloadLimit : ?Nat;
  };

  type NewProduct = {
    id : Text;
    name : Text;
    description : Text;
    priceCents : Nat;
    category : Text;
    featured : Bool;
    images : [Blob];
    createdAt : Int;
    digitalDownload : ?NewDigitalDownload;
  };

  type NewActor = {
    products : Map.Map<Text, NewProduct>;
  };

  // Migration function
  public func run(old : OldActor) : NewActor {
    let newProducts = old.products.map<Text, OldProduct, NewProduct>(
      func(_id, oldProduct) {
        { oldProduct with digitalDownload = null };
      }
    );
    { products = newProducts };
  };
};
