import * as React from "react";
import { NextContextWithApollo } from "../types/NextContextWithApollo";
import gql from "graphql-tag";

export default class Index extends React.PureComponent {
  static async getInitialProps({ apolloClient }: NextContextWithApollo) {
    const response = await apolloClient.query({
      query: gql`
        {
          me {
            id
            username
            pictureUrl
            bio
          }
        }
      `
    });
    console.log(response);
    return {};
  }

  render() {
    return null;
  }
}
