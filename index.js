const express = require('express')
const app = express()
const userData = require('./MOCK_DATA.json');
const graphql = require('graphql');
const {graphqlHTTP} = require('express-graphql');
const { query } = require('express');
 const UserType = new graphql.GraphQLObjectType({
    name: "User",
    fields: () =>({
       id: {type: graphql.GraphQLInt},
       first_name: {type: graphql.GraphQLString},
       last_name: {type: graphql.GraphQLString},
       email: {type: graphql.GraphQLString},
       gender: {type: graphql.GraphQLString},

    })
 })

const RootQuery = new graphql.GraphQLObjectType({
   name: "RootQueryType",
   fields: {
      getAllUsers: {
         type: new graphql.GraphQLList(UserType),
         args: {id: {type: graphql.GraphQLInt}},
         resolve(parent, args){
            return userData
         }
      }
   }
});
const Mutation = new graphql.GraphQLObjectType({
   name: "Mutation",
   fields: {
      createUser:{
         type: UserType,
         args:{
            first_name: {
               type: graphql.GraphQLString
            },
            last_name: {
               type: graphql.GraphQLString
            },
            email: {
               type: graphql.GraphQLString
            },
            gender: {
               type: graphql.GraphQLString
            }
         },
         resolve(parent, args){
            userData.push({
               id: userData.length + 1, 
               first_name: args.first_name,
               last_name: args.last_name,
               email: args.email,
               gender: args.gender
            })
            return args
         }
      }
   }
})


const schema = new graphql.GraphQLSchema({query: RootQuery, mutation: Mutation})

app.use('/graphql', graphqlHTTP({
   schema,
   graphiql: true
}));


app.listen(3000 , ()=> console.log('> Server is up and running on port : ' + 3000))