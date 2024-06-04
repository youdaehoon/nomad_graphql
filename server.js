import { ApolloServer, gql } from "apollo-server";
import fetch from "node-fetch";
let tweets = [
  {
    id: "1",
    text: "first one",
    userId: "2",
  },
  {
    id: "2",
    text: "second one",
    userId: "1",
  },
];

let users = [
  {
    id: "1",
    firstName: "nico",
    lastName: "las",
  },
  {
    id: "2",
    firstName: "elon",
    lastName: "Mask",
  },
];

const typeDefs = gql`
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    """
    fullName is sum of firstname and lastname
    """
    fullName: String!
  }
  """
  Tweet object represnts a resouce for a Tweet
  """
  type Tweet {
    id: ID!
    text: String!
    author: User
  }
  type Query {
    allMovies: [Movie!]!
    movie(id: ID!): Movie
    allUsers: [User!]!
    allTweets: [Tweet!]!
    tweet(id: ID!): Tweet
  }
  type Mutation {
    postTweet(text: String!, userId: ID!): Tweet!
    """
    delete a tweet if found,else returns false
    """
    deleteTweet(id: ID!): Boolean!
  }
  type Movie {
    id: Int!
    url: String!
    imdb_code: String!
    title: String!
    title_english: String!
    title_long: String!
    slug: String!
    year: Int!
    rating: Float!
    runtime: Float!
    genres: [String!]!
    summary: String
    description_full: String!
    synopsis: String!
    yt_trailer_code: String!
    language: String!
    mpa_rating: String!
    background_image: String!
    background_image_original: String!
    small_cover_image: String!
    medium_cover_image: String!
    large_cover_image: String!
    state: String!
    torrents: [Torrent!]!
    date_uploaded: String!
    date_uploaded_unix: Int!
  }
  type Torrent {
    url: String!
    hash: String!
    quality: String!
    type: String!
    is_repack: String!
    video_codec: String!
    bit_depth: String!
    audio_channels: String!
    seeds: Float!
    peers: Float!
    size: String!
    size_bytes: Int!
    date_uploaded: String!
    date_uploaded_unix: Int!
  }
`;

const resolvers = {
  Query: {
    allMovies() {
      return fetch("https://yts.mx/api/v2/list_movies.json").then((r) =>
        r.json().then((json) => json.data.movies)
      );
    },
    movie(_, { id }) {
      return fetch(
        `https://yts.mx/api/v2/movie_details.json?movie_id=${id}`
      ).then((r) => r.json().then((json) => json.data.movie));
    },
    allUsers() {
      return users;
    },

    allTweets() {
      return tweets;
    },
    tweet(root, { id }) {
      return tweets.find((tweet) => tweet.id === id);
    },
  },
  Mutation: {
    postTweet(_, { text, userId }) {
      const newTweet = {
        id: tweets.length + 1,
        text,
        userId,
      };
      tweets.push(newTweet);
      return newTweet;
    },
    deleteTweet(_, { id }) {
      const tweet = tweets.find((tweet) => tweet.id === id);
      if (!tweet) return false;

      tweets = tweets.filter((tweet) => tweet.id !== id);
      return true;
    },
  },
  User: {
    fullName({ firstName, lastName }) {
      return `${firstName} ${lastName}`;
    },
  },
  Tweet: {
    author({ userId }) {
      return users.find((user) => user.id === userId);
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`Running on ${url}`);
});
