import { gql } from '@apollo/client';

// User Authentication Mutations
export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      success
      user {
        id
        email
        name
        avatar
        role
      }
      token
      message
    }
  }
`;

export const REGISTER = gql`
  mutation Register($email: String!, $name: String!, $password: String!) {
    register(email: $email, name: $name, password: $password) {
      success
      user {
        id
        email
        name
        avatar
        role
      }
      token
      message
    }
  }
`;

export const UPDATE_USER_PROFILE = gql`
  mutation UpdateUserProfile($name: String, $avatar: String, $phone: String, $address: String) {
    updateUserProfile(name: $name, avatar: $avatar, phone: $phone, address: $address) {
      success
      user {
        id
        email
        name
        avatar
        phone
        address
        role
      }
      message
    }
  }
`;

export const LOGOUT = gql`
  mutation Logout {
    logout {
      success
      message
    }
  }
`;

export const REFRESH_TOKEN = gql`
  mutation RefreshToken {
    refreshToken {
      success
      token
      message
    }
  }
`;
