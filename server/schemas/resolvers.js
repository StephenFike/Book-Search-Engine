const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const { User, Book } = require('../models');
const { sign } = require('jsonwebtoken');

const resolvers = {
    Query:{
        me: async (parent, args, context) =>{
            if(context.user){
                const userData = await User.findOne({ _id: context.user._id})
                .select('-__v -password')
                
                return userData;
            }
            throw new AuthenticationError('Not logged in!');
        }
    },
    Mutation:{
        addUser: async (parent, args) =>{
            const user = await User.create(args);
            const token = signToken(user);

            return { token, user };
        },
        login: async (parent, { email, password}) =>{
            const user = await User.findOne({ email });

            if(!user){
                throw new AuthenticationError('Incorrect credentials');
            }
            const correctPw = user.isCorrectPassword(password);

            if(!correctPw){
                throw new AuthenticationError('Incorrect credentials');
            }
            const token = signToken(user);
            return { token, user };
        },
        saveBook: async (parent, { book }, context) => {
            if (context.user) {
              const addBook = await User.findOneAndUpdate(
                { _id: context.user._id },
                { $push: { savedBooks: book } },
                { new: true, runValidators: true }
              );
              return addBook;
            }  
            throw new AuthenticationError('You need to be logged in!');
          },
        removeBook: async(parent, { bookId }, context) =>{
            if(user.context){
                const removeBook = await User.findOneAndUpdate(
                    {_id: context.user._id},
                    { $pull: {savedBooks: { bookId } }},
                    {new: true }
                )
                return removeBook;
            }
            throw new AuthenticationError('You must be logged in!');
        }
    }
};

module.exports = resolvers;