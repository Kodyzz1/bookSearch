// server/src/schema/resolvers.ts
import { AuthenticationError } from 'apollo-server-express';
import User from '../models/User';
import bookSchema from '../models/Book';
import { signToken } from '../services/auth';
import bcrypt from 'bcrypt';

const resolvers = {
  Query: {
    me: async (_: any, args: any, context: { user: any }) => {
      if (context.user) {
        return User.findById(context.user._id).populate('savedBooks');
      }
      throw new AuthenticationError('Not logged in');
    },
  },
  Mutation: {
    login: async (_: any, { email, password }: { email: string, password: string }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const correctPw = await bcrypt.compare(password, user.password);
      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },
    addUser: async (_: any, { username, email, password }: { username: string, email: string, password: string }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(username, email, user._id);
      return { token, user };
    },
    saveBook: async (parent: any, { input }: { input: any }, context: { user: any }) => {
      if (context.user) {
        const updatedUser = await User.findByIdAndUpdate(
          context.user._id,
          { $addToSet: { savedBooks: input } },
          { new: true }
        ).populate('savedBooks');
        return updatedUser;
      }
      throw new AuthenticationError('You need to be logged in');
    },
    removeBook: async (_, { bookId }: { bookId: string }, context: { user: any }) => {
      if (context.user) {
        const updatedUser = await User.findByIdAndUpdate(
          context.user._id,
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        ).populate('savedBooks');
        return updatedUser;
      }
      throw new AuthenticationError('You need to be logged in');
    },
  },
};

export default resolvers;
