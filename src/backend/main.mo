import List "mo:core/List";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import { addAll } "mo:core/List";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  // Initialize the access control system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User profile system
  public type UserProfile = {
    name : Text;
    email : ?Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
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

  // Coaching system data structures
  let coachingTopics = List.empty<Text>();
  let goalsMap = Map.empty<Principal, Map.Map<Text, List.List<Text>>>();
  var availability : Bool = true;
  let sessionHistory = Map.empty<Principal, List.List<Text>>();

  // Admin-only: Toggle system availability
  public shared ({ caller }) func toggleAvailability(status : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    availability := status;
  };

  // Public query: Anyone can check availability
  public query ({ caller }) func getAvailability() : async Bool {
    availability;
  };

  // Admin-only: Add coaching topics
  public shared ({ caller }) func addCoachingTopic(topic : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    let topicsArray = coachingTopics.toArray();
    for (existingTopic in topicsArray.values()) {
      if (existingTopic == topic) {
        return;
      };
    };
    coachingTopics.add(topic);
  };

  // Public query: Anyone can view available topics
  public query ({ caller }) func getCoachingTopics() : async [Text] {
    coachingTopics.toArray();
  };

  // User-only: Set goals for the caller
  public shared ({ caller }) func setGoals(topic : Text, newGoals : [Text]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can perform this action");
    };
    let goalsList = List.fromArray(newGoals);
    switch (goalsMap.get(caller)) {
      case (null) {
        let topicMap = Map.empty<Text, List.List<Text>>();
        topicMap.add(topic, goalsList);
        goalsMap.add(caller, topicMap);
      };
      case (?topicMap) {
        topicMap.add(topic, goalsList);
      };
    };
  };

  // Query with ownership check: Users can only see their own goals, admins can see any
  public query ({ caller }) func getGoals(user : Principal, topic : Text) : async [Text] {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own goals");
    };
    switch (goalsMap.get(user)) {
      case (null) { [] };
      case (?topicMap) {
        switch (topicMap.get(topic)) {
          case (null) { [] };
          case (?goals) { goals.toArray() };
        };
      };
    };
  };

  // User-only: Add session to caller's history
  public shared ({ caller }) func addSessionToHistory(session : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can perform this action");
    };
    switch (sessionHistory.get(caller)) {
      case (null) {
        let newList = List.empty<Text>();
        newList.add(session);
        sessionHistory.add(caller, newList);
      };
      case (?history) {
        history.add(session);
      };
    };
  };

  // Query with ownership check: Users can only see their own history, admins can see any
  public query ({ caller }) func getSessionHistory(user : Principal) : async {
    #Sessions : [Text];
    #Empty : Bool;
  } {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own session history");
    };
    switch (sessionHistory.get(user)) {
      case (null) { #Empty(true) };
      case (?history) {
        #Sessions(history.toArray());
      };
    };
  };

  // User-only: Start a coaching session
  public shared ({ caller }) func startSession(topic : Text) : async {
    #Error : Text;
    #Success : Text;
  } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can perform this action");
    };
    if (not availability) {
      return #Error("Coaching service is currently unavailable");
    };
    let topicsArray = coachingTopics.toArray();
    var topicExists = false;
    var index = 0;
    while (index < topicsArray.size() and not topicExists) {
      if (topicsArray[index] == topic) {
        topicExists := true;
      };
      index += 1;
    };
    if (not topicExists) {
      return #Error("Topic not found");
    };
    #Success("Session started for topic: " # topic);
  };

  // User-only: Add goals to caller's existing goals
  public shared ({ caller }) func addGoals(topic : Text, newGoals : [Text]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can perform this action");
    };
    if (newGoals.size() == 0) {
      return;
    };
    switch (goalsMap.get(caller)) {
      case (null) {
        let topicMap = Map.empty<Text, List.List<Text>>();
        let newList = List.fromArray(newGoals);
        topicMap.add(topic, newList);
        goalsMap.add(caller, topicMap);
      };
      case (?topicMap) {
        switch (topicMap.get(topic)) {
          case (null) {
            let newList = List.fromArray(newGoals);
            topicMap.add(topic, newList);
          };
          case (?existingGoals) {
            let newList = List.fromArray(newGoals);
            existingGoals.addAll(newList.values());
          };
        };
      };
    };
  };

  // Query with ownership check: Validate caller's goal
  public query ({ caller }) func validateGoal(user : Principal, topic : Text, goal : Text) : async {
    #GoalExists : Text;
    #GoalNotFound : Text;
  } {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only validate your own goals");
    };
    switch (goalsMap.get(user)) {
      case (null) { #GoalNotFound("Goal not found") };
      case (?topicMap) {
        switch (topicMap.get(topic)) {
          case (null) { #GoalNotFound("Goal not found") };
          case (?goals) {
            let goalsArray = goals.toArray();
            for (existingGoal in goalsArray.values()) {
              if (existingGoal == goal) {
                return #GoalExists("Goal exists");
              };
            };
            #GoalNotFound("Goal not found");
          };
        };
      };
    };
  };

  // User-only: Remove goal from caller's goals
  public shared ({ caller }) func removeGoal(topic : Text, goal : Text) : async {
    #Success : Text;
    #Failure : Text;
  } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can perform this action");
    };
    switch (goalsMap.get(caller)) {
      case (null) { #Failure("Goal not found") };
      case (?topicMap) {
        switch (topicMap.get(topic)) {
          case (null) { #Failure("Goal not found") };
          case (?goals) {
            let updatedGoals = goals.filter(func(g : Text) : Bool { g != goal });
            if (updatedGoals.size() == goals.size()) {
              #Failure("Goal not found");
            } else {
              topicMap.add(topic, updatedGoals);
              #Success("Goal removed");
            };
          };
        };
      };
    };
  };
};
