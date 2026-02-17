import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Set "mo:core/Set";
import Order "mo:core/Order";
import Text "mo:core/Text";
import Bool "mo:core/Bool";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  type CategoryID = Nat;
  type WritingID = Nat;

  module Category {
    public type Status = { #active; #inactive };
    public type Category = {
      id : CategoryID;
      title : Text;
      focusBannerUrl : Text;
      parentCategoryId : ?CategoryID;
      status : Status;
      subcategoryIds : [CategoryID];
      supportedLanguages : [Text];
    };

    public func compare(category1 : Category, category2 : Category) : Order.Order {
      Nat.compare(category1.id, category2.id);
    };
  };

  module Writing {
    public type WritingState = { #draft; #pending; #rejected; #published };
    public type Writing = {
      id : WritingID;
      author : ?Principal;
      title : Text;
      content : Text;
      state : WritingState;
      parentPageId : ?WritingID;
      categories : [CategoryID];
      submissions : Nat;
      contentWarnings : [Text];
    };

    public func compare(writing1 : Writing, writing2 : Writing) : Order.Order {
      Nat.compare(writing1.id, writing2.id);
    };
  };

  public type UserProfile = {
    name : Text;
  };

  let categories = Map.empty<CategoryID, Category.Category>();
  let writings = Map.empty<WritingID, Writing.Writing>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  var nextCategoryId = 1 : CategoryID;
  var nextWritingId = 1 : WritingID;

  // Mix in the authorization component
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
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

  public shared ({ caller }) func createCategory(title : Text, parentCategoryId : ?CategoryID, supportedLanguages : [Text], focusBannerUrl : Text, status : Category.Status) : async CategoryID {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create categories");
    };
    let category : Category.Category = {
      id = nextCategoryId;
      title;
      focusBannerUrl;
      parentCategoryId;
      status;
      subcategoryIds = [];
      supportedLanguages;
    };

    categories.add(nextCategoryId, category);
    nextCategoryId += 1;
    category.id;
  };

  public shared ({ caller }) func updateCategory(id : CategoryID, title : Text, parentCategoryId : ?CategoryID, supportedLanguages : [Text], focusBannerUrl : Text, status : Category.Status) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update categories");
    };
    switch (categories.get(id)) {
      case (null) { Runtime.trap("Category not found") };
      case (?_) {
        let updatedCategory : Category.Category = {
          id;
          title;
          focusBannerUrl;
          parentCategoryId;
          status;
          subcategoryIds = [];
          supportedLanguages;
        };
        categories.add(id, updatedCategory);
      };
    };
  };

  public shared ({ caller }) func deleteCategory(id : CategoryID) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete categories");
    };
    switch (categories.get(id)) {
      case (null) { Runtime.trap("Category not found") };
      case (?_) {
        categories.remove(id);
      };
    };
  };

  public shared ({ caller }) func submitWriting(title : Text, categoryIds : [CategoryID], content : Text, contentWarningList : [Text]) : async WritingID {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can submit writings");
    };

    let writing : Writing.Writing = {
      id = nextWritingId;
      author = ?caller;
      title;
      content;
      state = #draft;
      parentPageId = null;
      categories = categoryIds;
      submissions = 1;
      contentWarnings = contentWarningList;
    };

    writings.add(writing.id, writing);
    nextWritingId += 1;
    writing.id;
  };

  public shared ({ caller }) func updateWriting(id : WritingID, title : Text, content : Text, categoryIds : [CategoryID], contentWarningList : [Text]) : async () {
    switch (writings.get(id)) {
      case (null) { Runtime.trap("Writing not found") };
      case (?existing) {
        let isAdmin = AccessControl.isAdmin(accessControlState, caller);
        let isAuthor = switch (existing.author) {
          case (?author) { Principal.equal(author, caller) };
          case (null) { false };
        };

        if (not isAdmin and not isAuthor) {
          Runtime.trap("Unauthorized: Only the author or admin can update this writing");
        };

        if (not isAdmin and existing.state != #draft) {
          Runtime.trap("Unauthorized: Only admins can update non-draft writings");
        };

        let updatedWriting : Writing.Writing = {
          existing with
          title;
          content;
          categories = categoryIds;
          contentWarnings = contentWarningList;
        };
        writings.add(id, updatedWriting);
      };
    };
  };

  public shared ({ caller }) func publishWriting(id : WritingID) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can publish writings");
    };
    switch (writings.get(id)) {
      case (null) { Runtime.trap("Writing not found") };
      case (?existing) {
        let updatedWriting : Writing.Writing = {
          existing with
          state = #published;
        };
        writings.add(id, updatedWriting);
      };
    };
  };

  public shared ({ caller }) func unpublishWriting(id : WritingID) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can unpublish writings");
    };
    switch (writings.get(id)) {
      case (null) { Runtime.trap("Writing not found") };
      case (?existing) {
        let updatedWriting : Writing.Writing = {
          existing with
          state = #draft;
        };
        writings.add(id, updatedWriting);
      };
    };
  };

  public shared ({ caller }) func deleteWriting(id : WritingID) : async () {
    switch (writings.get(id)) {
      case (null) { Runtime.trap("Writing not found") };
      case (?existing) {
        let isAdmin = AccessControl.isAdmin(accessControlState, caller);
        let isAuthor = switch (existing.author) {
          case (?author) { Principal.equal(author, caller) };
          case (null) { false };
        };

        if (not isAdmin and not isAuthor) {
          Runtime.trap("Unauthorized: Only the author or admin can delete this writing");
        };

        writings.remove(id);
      };
    };
  };

  public query ({ caller }) func getWriting(id : WritingID) : async Writing.Writing {
    switch (writings.get(id)) {
      case (null) { Runtime.trap("Writing not found") };
      case (?writing) {
        if (writing.state == #published) {
          return writing;
        };

        let isAdmin = AccessControl.isAdmin(accessControlState, caller);
        let isAuthor = switch (writing.author) {
          case (?author) { Principal.equal(author, caller) };
          case (null) { false };
        };

        if (isAdmin or isAuthor) {
          return writing;
        };

        Runtime.trap("Unauthorized: Only the author or admin can view unpublished writings");
      };
    };
  };

  public query ({ caller }) func getCategory(id : CategoryID) : async Category.Category {
    switch (categories.get(id)) {
      case (null) { Runtime.trap("Category not found") };
      case (?category) { category };
    };
  };

  public query ({ caller }) func getPublishedWritings() : async [Writing.Writing] {
    writings.values().filter(func(w) { w.state == #published }).toArray().sort();
  };

  public query ({ caller }) func getCategories(parentCategoryId : ?CategoryID) : async [Category.Category] {
    categories.values().filter(func(c) { c.parentCategoryId == parentCategoryId }).toArray().sort();
  };

  public shared ({ caller }) func associateCategory(writingId : WritingID, categoryId : CategoryID) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can associate categories");
    };
    switch (writings.get(writingId), categories.get(categoryId)) {
      case (null, _) { Runtime.trap("Writing not found") };
      case (_, null) { Runtime.trap("Category not found") };
      case (?writing, ?_) {
        let updatedCategories = writing.categories.concat([categoryId]);
        let updatedWriting = { writing with categories = updatedCategories };
        writings.add(writingId, updatedWriting);
      };
    };
  };

  public query ({ caller }) func categoryHasLanguages(categoryId : CategoryID, languages : [Text]) : async Bool {
    switch (categories.get(categoryId)) {
      case (null) { Runtime.trap("Category not found") };
      case (?category) {
        languages.all(
          func(lang) {
            category.supportedLanguages.any(func(supportedLang) { supportedLang == lang });
          }
        );
      };
    };
  };

  public shared ({ caller }) func migrateWritings() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform migration");
    };

    if (writings.isEmpty()) { Runtime.trap("No writings to migrate") };

    var migrated = 0;
    for ((id, writing) in writings.entries()) {
      if (writing.state == #draft) {
        let updatedWriting : Writing.Writing = {
          writing with
          state = #draft;
        };
        writings.add(id, updatedWriting);
        migrated += 1;
      };
    };
    migrated;
  };

  public query ({ caller }) func getActiveChildCategories(parentCategoryId : ?CategoryID) : async [Category.Category] {
    categories.values().filter(func(c) { c.parentCategoryId == parentCategoryId and c.status == #active }).toArray().sort();
  };
};
