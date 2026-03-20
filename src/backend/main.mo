import Iter "mo:core/Iter";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type RoomType = {
    #standard;
    #deluxe;
    #family;
  };

  public type BookingStatus = {
    #pending;
    #confirmed;
    #cancelled;
  };

  public type Booking = {
    id : Nat;
    guestName : Text;
    email : Text;
    phone : Text;
    checkIn : Text; // date in Text format
    checkOut : Text; // date in Text format
    roomType : RoomType;
    numberOfGuests : Nat;
    status : BookingStatus;
    createdAt : Int;
    owner : Principal;
  };

  public type UserProfile = {
    name : Text;
  };

  var nextBookingId = 1;

  let bookings = Map.empty<Nat, Booking>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // User profile management
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

  // Booking management
  public shared ({ caller }) func createBooking(
    guestName : Text,
    email : Text,
    phone : Text,
    checkIn : Text,
    checkOut : Text,
    roomType : RoomType,
    numberOfGuests : Nat,
  ) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create bookings");
    };

    let booking : Booking = {
      id = nextBookingId;
      guestName;
      email;
      phone;
      checkIn;
      checkOut;
      roomType;
      numberOfGuests;
      status = #pending;
      createdAt = Time.now();
      owner = caller;
    };

    bookings.add(nextBookingId, booking);
    let bookingId = nextBookingId;
    nextBookingId += 1;
    bookingId;
  };

  public query ({ caller }) func getBooking(id : Nat) : async ?Booking {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can fetch bookings");
    };

    switch (bookings.get(id)) {
      case (null) { null };
      case (?booking) {
        // Users can only see their own bookings, admins can see all
        if (booking.owner == caller or AccessControl.isAdmin(accessControlState, caller)) {
          ?booking;
        } else {
          Runtime.trap("Unauthorized: Can only view your own bookings");
        };
      };
    };
  };

  public query ({ caller }) func getCallerBookings() : async [Booking] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can fetch their own bookings");
    };

    bookings.values().filter(
      func(booking) {
        booking.owner == caller;
      }
    ).toArray();
  };

  public query ({ caller }) func getAllBookings() : async [Booking] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all bookings");
    };

    bookings.values().toArray();
  };

  public shared ({ caller }) func updateBookingStatus(id : Nat, status : BookingStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update booking status");
    };

    switch (bookings.get(id)) {
      case (null) { Runtime.trap("Booking not found") };
      case (?booking) {
        let updatedBooking = { booking with status };
        bookings.add(id, updatedBooking);
      };
    };
  };

  public shared ({ caller }) func deleteBooking(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete bookings");
    };

    bookings.remove(id);
  };
};
