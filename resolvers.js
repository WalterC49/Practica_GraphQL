import { GraphQLError } from "graphql";
import Person from "./models/person.js";
import User from "./models/user.js";
import jwt from "jsonwebtoken";
import { PubSub } from "graphql-subscriptions";

const pubsub = new PubSub();

const SUBSCRIPTION_EVENTS = {
  PERSON_ADDED: "PERSON_ADDED",
};

export const resolvers = {
  Query: {
    personCount: () => Person.collection.countDocuments(),
    allPersons: async (root, args) => {
      if (!args.phone) return Person.find();
      /* 
      const byPhone = (person) =>
        args.phone === "YES" ? person.phone : !person.phone;

      const persons = await Person.find();

      return persons.filter(byPhone); */
      return await Person.find({ phone: { $exists: args.phone === "YES" } });
    },
    findPerson: async (root, args) => {
      const { name } = args;
      return await Person.findOne({ name });
    },
    me: (root, args, context) => {
      return context.currentUser;
    },
  },
  Person: {
    address: (root) => {
      return {
        street: root.street,
        city: root.city,
      };
    },
  },
  Mutation: {
    addPerson: async (root, args, context) => {
      const { currentUser } = context;
      if (!currentUser) {
        throw new GraphQLError("Not authenticated.", {
          extensions: {
            code: "BAD_USER_INPUTS",
          },
        });
      }

      const person = new Person({ ...args });
      try {
        await person.save();
        currentUser.friends = currentUser.friends.concat(person);
        await currentUser.save();
      } catch (error) {
        console.log("error", error);
        throw new GraphQLError("Saving user failed.", {
          extensions: {
            code: "BAD_USER_INPUTS",
          },
        });
      }
      pubsub.publish(SUBSCRIPTION_EVENTS.PERSON_ADDED, { personAdded: person });
      return person;
    },
    editNumber: async (root, args) => {
      const { name, phone } = args;
      const person = await Person.findOne({ name });

      if (!person) return null;

      person.phone = phone;

      try {
        await person.save();
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        });
      }
      return person;
    },
    createUser: (root, args) => {
      const user = new User({ username: args.username });
      return user.save().catch((error) => {
        throw new GraphQLError("Creating the user failed.", {
          extensions: {
            code: "BAD_USER_INPUT",
            error,
          },
        });
      });
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });
      if (!user || args.password !== "secret") {
        throw new GraphQLError("Wrong credentials.", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };

      return {
        value: jwt.sign(userForToken, process.env.JWT_SECRET),
      };
    },
    addAsFriend: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new GraphQLError("Wrong credentials.", {
          extensions: {
            code: "BAD_USER_INPUTS",
          },
        });
      }

      const person = await Person.findOne({ name: args.name });
      if (!person) {
        throw new GraphQLError("Couldn't find person.", {
          extensions: {
            code: "BAD_USER_INPUTS",
          },
        });
      }

      const nonFriendlyAlredy = (person) =>
        !currentUser.friends
          .map((f) => f._id.toString())
          .includes(person._id.toString());

      if (nonFriendlyAlredy(person)) {
        currentUser.friends = currentUser.friends.concat(person);
        await currentUser.save();
      }

      return currentUser;
    },
  },
  Subscription: {
    personAdded: {
      subscribe: () => pubsub.asyncIterator(SUBSCRIPTION_EVENTS.PERSON_ADDED),
    },
  },
};
