const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type User{
        _id: ID
        username: String
        email: String
        bookCount: Int
        savedBooks: [Book]
    }
    type Book {
        bookId: ID
        authors:[String]
        title: String
        description: String
        image: String
        link: String
    }
    type Query{
        me: User
    }
    type Auth{
        token: ID!
        user: User
    }
    input BookInfo{
        bookId: ID!
        authors: [String]
        title: String
        description: String
        image: String
        link: String
    }
    type Mutation{
        login(email: String!, password: String!): Auth
        addUser(username: String!, email: String!, password: String!): Auth
        saveBook(book: BookInfo!): User
        removeBook(bookId: ID!): User
    }
`;

module.exports = typeDefs;