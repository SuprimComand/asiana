import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /**
   * The `Date` scalar type represents a Date
   * value as specified by
   * [iso8601](https://en.wikipedia.org/wiki/ISO_8601).
   */
  Date: any;
  /**
   * The `DateTime` scalar type represents a DateTime
   * value as specified by
   * [iso8601](https://en.wikipedia.org/wiki/ISO_8601).
   */
  DateTime: any;
};

export type Query = {
  __typename?: 'Query';
  profile?: Maybe<ProfileType>;
  profiles?: Maybe<Array<Maybe<ProfileType>>>;
  address?: Maybe<AddressType>;
  addresses?: Maybe<Array<Maybe<AddressType>>>;
  cars?: Maybe<Array<Maybe<CarType>>>;
  profileCars?: Maybe<Array<Maybe<ProfileCarType>>>;
  action?: Maybe<ActionType>;
  actions?: Maybe<Array<Maybe<ActionType>>>;
};

export type QueryProfileArgs = {
  userId?: Maybe<Scalars['Int']>;
};

export type QueryProfilesArgs = {
  userId?: Maybe<Scalars['Int']>;
};

export type QueryAddressArgs = {
  id?: Maybe<Scalars['Int']>;
};

export type QueryProfileCarsArgs = {
  profileId?: Maybe<Scalars['Int']>;
};

export type QueryActionArgs = {
  id?: Maybe<Scalars['Int']>;
};

export type ProfileType = {
  __typename?: 'ProfileType';
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  birthday?: Maybe<Scalars['Date']>;
  address?: Maybe<AddressType>;
  gender?: Maybe<Scalars['Int']>;
  profilecarSet: Array<ProfileCarType>;
};

export type AddressType = {
  __typename?: 'AddressType';
  id: Scalars['ID'];
  type: Scalars['String'];
  address: Scalars['String'];
  workTime: Scalars['String'];
  phone: Scalars['String'];
  coordinates: Scalars['String'];
  profileSet: Array<ProfileType>;
};

export type ProfileCarType = {
  __typename?: 'ProfileCarType';
  id: Scalars['ID'];
  profile: ProfileType;
  car: CarType;
  date: Scalars['Date'];
  source: Scalars['String'];
  active: Scalars['Int'];
};

export type CarType = {
  __typename?: 'CarType';
  id: Scalars['ID'];
  brand: Scalars['String'];
  model: Scalars['String'];
  complectation: Scalars['String'];
  profilecarSet: Array<ProfileCarType>;
};

export type ActionType = {
  __typename?: 'ActionType';
  id: Scalars['ID'];
  date: Scalars['DateTime'];
  title: Scalars['String'];
  image?: Maybe<Scalars['String']>;
  teaser?: Maybe<Scalars['String']>;
  body?: Maybe<Scalars['String']>;
  button: Scalars['Int'];
  sort: Scalars['Int'];
  status: Scalars['Int'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createProfile?: Maybe<CreateProfile>;
  createAddress?: Maybe<CreateAddress>;
  updateProfile?: Maybe<UpdateProfile>;
  createProfileCar?: Maybe<CreateProfileCar>;
  updateProfileCar?: Maybe<UpdateProfileCar>;
  deleteProfileCar?: Maybe<DeleteProfileCar>;
};

export type MutationCreateProfileArgs = {
  input: ProfileInput;
};

export type MutationCreateAddressArgs = {
  input: AddressInput;
};

export type MutationUpdateProfileArgs = {
  id: Scalars['String'];
  input: ProfileInput;
};

export type MutationCreateProfileCarArgs = {
  input: ProfileCarInput;
};

export type MutationUpdateProfileCarArgs = {
  id: Scalars['String'];
  input: ProfileCarActiveInput;
};

export type MutationDeleteProfileCarArgs = {
  id: Scalars['String'];
};

export type CreateProfile = {
  __typename?: 'CreateProfile';
  ok?: Maybe<Scalars['Boolean']>;
  profile?: Maybe<ProfileType>;
};

export type ProfileInput = {
  userId?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  addressId?: Maybe<Scalars['Int']>;
  birthday?: Maybe<Scalars['Date']>;
  gender?: Maybe<Scalars['Int']>;
  profileId?: Maybe<Scalars['String']>;
};

export type CreateAddress = {
  __typename?: 'CreateAddress';
  ok?: Maybe<Scalars['Boolean']>;
  address?: Maybe<AddressType>;
};

export type AddressInput = {
  type?: Maybe<Scalars['String']>;
  address?: Maybe<Scalars['String']>;
  workTime?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  coordinates?: Maybe<Scalars['String']>;
};

export type UpdateProfile = {
  __typename?: 'UpdateProfile';
  ok?: Maybe<Scalars['Boolean']>;
  profile?: Maybe<ProfileType>;
};

export type CreateProfileCar = {
  __typename?: 'CreateProfileCar';
  ok?: Maybe<Scalars['Boolean']>;
  profileCar?: Maybe<ProfileCarType>;
};

export type ProfileCarInput = {
  profileId?: Maybe<Scalars['Int']>;
  car?: Maybe<CarInput>;
  source?: Maybe<Scalars['String']>;
  active?: Maybe<Scalars['Int']>;
};

export type CarInput = {
  brand?: Maybe<Scalars['String']>;
  model?: Maybe<Scalars['String']>;
  complectation?: Maybe<Scalars['String']>;
};

export type UpdateProfileCar = {
  __typename?: 'UpdateProfileCar';
  ok?: Maybe<Scalars['Boolean']>;
  profileCar?: Maybe<ProfileCarType>;
};

export type ProfileCarActiveInput = {
  active?: Maybe<Scalars['Int']>;
};

export type DeleteProfileCar = {
  __typename?: 'DeleteProfileCar';
  ok?: Maybe<Scalars['Boolean']>;
  profileCar?: Maybe<ProfileCarType>;
};

export type ActionFragment = { __typename?: 'ActionType' } & Pick<
  ActionType,
  | 'id'
  | 'date'
  | 'title'
  | 'image'
  | 'teaser'
  | 'body'
  | 'button'
  | 'sort'
  | 'status'
>;

export type AddressFragment = { __typename?: 'AddressType' } & Pick<
  AddressType,
  'id' | 'type' | 'address' | 'workTime' | 'phone' | 'coordinates'
> & {
    profileSet: Array<
      { __typename?: 'ProfileType' } & Pick<
        ProfileType,
        'id' | 'name' | 'email' | 'birthday'
      > & {
          address?: Maybe<
            { __typename?: 'AddressType' } & Pick<
              AddressType,
              'id' | 'type' | 'address' | 'workTime' | 'phone' | 'coordinates'
            > & {
                profileSet: Array<
                  { __typename?: 'ProfileType' } & Pick<
                    ProfileType,
                    'id' | 'name' | 'email' | 'birthday'
                  > & {
                      address?: Maybe<
                        { __typename?: 'AddressType' } & Pick<
                          AddressType,
                          | 'id'
                          | 'type'
                          | 'address'
                          | 'workTime'
                          | 'phone'
                          | 'coordinates'
                        >
                      >;
                    }
                >;
              }
          >;
        }
    >;
  };

export type CarFragment = { __typename?: 'CarType' } & Pick<
  CarType,
  'id' | 'brand' | 'model' | 'complectation'
>;

export type ProfileFragment = { __typename?: 'ProfileType' } & Pick<
  ProfileType,
  'id' | 'name' | 'email' | 'birthday'
> & { address?: Maybe<{ __typename?: 'AddressType' } & AddressFragment> };

export type ProfileCarFragment = { __typename?: 'ProfileCarType' } & Pick<
  ProfileCarType,
  'id' | 'date' | 'source' | 'active'
> & {
    car: { __typename?: 'CarType' } & CarFragment;
    profile: { __typename?: 'ProfileType' } & ProfileFragment;
  };

export type CreateProfileCarMutationVariables = Exact<{
  input: ProfileCarInput;
}>;

export type CreateProfileCarMutation = { __typename?: 'Mutation' } & {
  createProfileCar?: Maybe<
    { __typename?: 'CreateProfileCar' } & Pick<CreateProfileCar, 'ok'> & {
        profileCar?: Maybe<
          { __typename?: 'ProfileCarType' } & ProfileCarFragment
        >;
      }
  >;
};

export type CreateProfileMutationVariables = Exact<{
  input: ProfileInput;
}>;

export type CreateProfileMutation = { __typename?: 'Mutation' } & {
  createProfile?: Maybe<
    { __typename?: 'CreateProfile' } & Pick<CreateProfile, 'ok'> & {
        profile?: Maybe<{ __typename?: 'ProfileType' } & ProfileFragment>;
      }
  >;
};

export type UpdateProfileCarMutationVariables = Exact<{
  id: Scalars['String'];
  input: ProfileCarActiveInput;
}>;

export type UpdateProfileCarMutation = { __typename?: 'Mutation' } & {
  updateProfileCar?: Maybe<
    { __typename?: 'UpdateProfileCar' } & Pick<UpdateProfileCar, 'ok'> & {
        profileCar?: Maybe<
          { __typename?: 'ProfileCarType' } & ProfileCarFragment
        >;
      }
  >;
};

export type ActionQueryVariables = Exact<{
  id?: Maybe<Scalars['Int']>;
}>;

export type ActionQuery = { __typename?: 'Query' } & {
  action?: Maybe<{ __typename?: 'ActionType' } & ActionFragment>;
};

export type ActionsQueryVariables = Exact<{ [key: string]: never }>;

export type ActionsQuery = { __typename?: 'Query' } & {
  actions?: Maybe<Array<Maybe<{ __typename?: 'ActionType' } & ActionFragment>>>;
};

export type AddressesQueryVariables = Exact<{ [key: string]: never }>;

export type AddressesQuery = { __typename?: 'Query' } & {
  addresses?: Maybe<
    Array<Maybe<{ __typename?: 'AddressType' } & AddressFragment>>
  >;
};

export type ProfileCarsQueryVariables = Exact<{
  profileId?: Maybe<Scalars['Int']>;
}>;

export type ProfileCarsQuery = { __typename?: 'Query' } & {
  profileCars?: Maybe<
    Array<Maybe<{ __typename?: 'ProfileCarType' } & ProfileCarFragment>>
  >;
};

export type ProfilesQueryVariables = Exact<{
  userId?: Maybe<Scalars['Int']>;
}>;

export type ProfilesQuery = { __typename?: 'Query' } & {
  profiles?: Maybe<
    Array<Maybe<{ __typename?: 'ProfileType' } & ProfileFragment>>
  >;
};

export const ActionFragmentDoc = gql`
  fragment action on ActionType {
    id
    date
    title
    image
    teaser
    body
    button
    sort
    status
  }
`;
export const CarFragmentDoc = gql`
  fragment car on CarType {
    id
    brand
    model
    complectation
  }
`;
export const AddressFragmentDoc = gql`
  fragment address on AddressType {
    id
    type
    address
    workTime
    phone
    coordinates
    profileSet {
      id
      name
      email
      birthday
      address {
        id
        type
        address
        workTime
        phone
        coordinates
        profileSet {
          id
          name
          email
          birthday
          address {
            id
            type
            address
            workTime
            phone
            coordinates
          }
        }
      }
    }
  }
`;
export const ProfileFragmentDoc = gql`
  fragment profile on ProfileType {
    id
    name
    email
    birthday
    address {
      ...address
    }
  }
  ${AddressFragmentDoc}
`;
export const ProfileCarFragmentDoc = gql`
  fragment profileCar on ProfileCarType {
    id
    car {
      ...car
    }
    profile {
      ...profile
    }
    date
    source
    active
  }
  ${CarFragmentDoc}
  ${ProfileFragmentDoc}
`;
export const CreateProfileCarDocument = gql`
  mutation createProfileCar($input: ProfileCarInput!) {
    createProfileCar(input: $input) {
      ok
      profileCar {
        ...profileCar
      }
    }
  }
  ${ProfileCarFragmentDoc}
`;
export type CreateProfileCarMutationFn = Apollo.MutationFunction<
  CreateProfileCarMutation,
  CreateProfileCarMutationVariables
>;

/**
 * __useCreateProfileCarMutation__
 *
 * To run a mutation, you first call `useCreateProfileCarMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateProfileCarMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createProfileCarMutation, { data, loading, error }] = useCreateProfileCarMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateProfileCarMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateProfileCarMutation,
    CreateProfileCarMutationVariables
  >,
) {
  return Apollo.useMutation<
    CreateProfileCarMutation,
    CreateProfileCarMutationVariables
  >(CreateProfileCarDocument, baseOptions);
}
export type CreateProfileCarMutationHookResult = ReturnType<
  typeof useCreateProfileCarMutation
>;
export type CreateProfileCarMutationResult = Apollo.MutationResult<CreateProfileCarMutation>;
export type CreateProfileCarMutationOptions = Apollo.BaseMutationOptions<
  CreateProfileCarMutation,
  CreateProfileCarMutationVariables
>;
export const CreateProfileDocument = gql`
  mutation createProfile($input: ProfileInput!) {
    createProfile(input: $input) {
      ok
      profile {
        ...profile
      }
    }
  }
  ${ProfileFragmentDoc}
`;
export type CreateProfileMutationFn = Apollo.MutationFunction<
  CreateProfileMutation,
  CreateProfileMutationVariables
>;

/**
 * __useCreateProfileMutation__
 *
 * To run a mutation, you first call `useCreateProfileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateProfileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createProfileMutation, { data, loading, error }] = useCreateProfileMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateProfileMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateProfileMutation,
    CreateProfileMutationVariables
  >,
) {
  return Apollo.useMutation<
    CreateProfileMutation,
    CreateProfileMutationVariables
  >(CreateProfileDocument, baseOptions);
}
export type CreateProfileMutationHookResult = ReturnType<
  typeof useCreateProfileMutation
>;
export type CreateProfileMutationResult = Apollo.MutationResult<CreateProfileMutation>;
export type CreateProfileMutationOptions = Apollo.BaseMutationOptions<
  CreateProfileMutation,
  CreateProfileMutationVariables
>;
export const UpdateProfileCarDocument = gql`
  mutation updateProfileCar($id: String!, $input: ProfileCarActiveInput!) {
    updateProfileCar(id: $id, input: $input) {
      ok
      profileCar {
        ...profileCar
      }
    }
  }
  ${ProfileCarFragmentDoc}
`;
export type UpdateProfileCarMutationFn = Apollo.MutationFunction<
  UpdateProfileCarMutation,
  UpdateProfileCarMutationVariables
>;

/**
 * __useUpdateProfileCarMutation__
 *
 * To run a mutation, you first call `useUpdateProfileCarMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateProfileCarMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateProfileCarMutation, { data, loading, error }] = useUpdateProfileCarMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateProfileCarMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateProfileCarMutation,
    UpdateProfileCarMutationVariables
  >,
) {
  return Apollo.useMutation<
    UpdateProfileCarMutation,
    UpdateProfileCarMutationVariables
  >(UpdateProfileCarDocument, baseOptions);
}
export type UpdateProfileCarMutationHookResult = ReturnType<
  typeof useUpdateProfileCarMutation
>;
export type UpdateProfileCarMutationResult = Apollo.MutationResult<UpdateProfileCarMutation>;
export type UpdateProfileCarMutationOptions = Apollo.BaseMutationOptions<
  UpdateProfileCarMutation,
  UpdateProfileCarMutationVariables
>;
export const ActionDocument = gql`
  query action($id: Int) {
    action(id: $id) {
      ...action
    }
  }
  ${ActionFragmentDoc}
`;

/**
 * __useActionQuery__
 *
 * To run a query within a React component, call `useActionQuery` and pass it any options that fit your needs.
 * When your component renders, `useActionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useActionQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useActionQuery(
  baseOptions?: Apollo.QueryHookOptions<ActionQuery, ActionQueryVariables>,
) {
  return Apollo.useQuery<ActionQuery, ActionQueryVariables>(
    ActionDocument,
    baseOptions,
  );
}
export function useActionLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<ActionQuery, ActionQueryVariables>,
) {
  return Apollo.useLazyQuery<ActionQuery, ActionQueryVariables>(
    ActionDocument,
    baseOptions,
  );
}
export type ActionQueryHookResult = ReturnType<typeof useActionQuery>;
export type ActionLazyQueryHookResult = ReturnType<typeof useActionLazyQuery>;
export type ActionQueryResult = Apollo.QueryResult<
  ActionQuery,
  ActionQueryVariables
>;
export const ActionsDocument = gql`
  query actions {
    actions {
      ...action
    }
  }
  ${ActionFragmentDoc}
`;

/**
 * __useActionsQuery__
 *
 * To run a query within a React component, call `useActionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useActionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useActionsQuery({
 *   variables: {
 *   },
 * });
 */
export function useActionsQuery(
  baseOptions?: Apollo.QueryHookOptions<ActionsQuery, ActionsQueryVariables>,
) {
  return Apollo.useQuery<ActionsQuery, ActionsQueryVariables>(
    ActionsDocument,
    baseOptions,
  );
}
export function useActionsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    ActionsQuery,
    ActionsQueryVariables
  >,
) {
  return Apollo.useLazyQuery<ActionsQuery, ActionsQueryVariables>(
    ActionsDocument,
    baseOptions,
  );
}
export type ActionsQueryHookResult = ReturnType<typeof useActionsQuery>;
export type ActionsLazyQueryHookResult = ReturnType<typeof useActionsLazyQuery>;
export type ActionsQueryResult = Apollo.QueryResult<
  ActionsQuery,
  ActionsQueryVariables
>;
export const AddressesDocument = gql`
  query addresses {
    addresses {
      ...address
    }
  }
  ${AddressFragmentDoc}
`;

/**
 * __useAddressesQuery__
 *
 * To run a query within a React component, call `useAddressesQuery` and pass it any options that fit your needs.
 * When your component renders, `useAddressesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAddressesQuery({
 *   variables: {
 *   },
 * });
 */
export function useAddressesQuery(
  baseOptions?: Apollo.QueryHookOptions<
    AddressesQuery,
    AddressesQueryVariables
  >,
) {
  return Apollo.useQuery<AddressesQuery, AddressesQueryVariables>(
    AddressesDocument,
    baseOptions,
  );
}
export function useAddressesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    AddressesQuery,
    AddressesQueryVariables
  >,
) {
  return Apollo.useLazyQuery<AddressesQuery, AddressesQueryVariables>(
    AddressesDocument,
    baseOptions,
  );
}
export type AddressesQueryHookResult = ReturnType<typeof useAddressesQuery>;
export type AddressesLazyQueryHookResult = ReturnType<
  typeof useAddressesLazyQuery
>;
export type AddressesQueryResult = Apollo.QueryResult<
  AddressesQuery,
  AddressesQueryVariables
>;
export const ProfileCarsDocument = gql`
  query profileCars($profileId: Int) {
    profileCars(profileId: $profileId) {
      ...profileCar
    }
  }
  ${ProfileCarFragmentDoc}
`;

/**
 * __useProfileCarsQuery__
 *
 * To run a query within a React component, call `useProfileCarsQuery` and pass it any options that fit your needs.
 * When your component renders, `useProfileCarsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProfileCarsQuery({
 *   variables: {
 *      profileId: // value for 'profileId'
 *   },
 * });
 */
export function useProfileCarsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    ProfileCarsQuery,
    ProfileCarsQueryVariables
  >,
) {
  return Apollo.useQuery<ProfileCarsQuery, ProfileCarsQueryVariables>(
    ProfileCarsDocument,
    baseOptions,
  );
}
export function useProfileCarsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    ProfileCarsQuery,
    ProfileCarsQueryVariables
  >,
) {
  return Apollo.useLazyQuery<ProfileCarsQuery, ProfileCarsQueryVariables>(
    ProfileCarsDocument,
    baseOptions,
  );
}
export type ProfileCarsQueryHookResult = ReturnType<typeof useProfileCarsQuery>;
export type ProfileCarsLazyQueryHookResult = ReturnType<
  typeof useProfileCarsLazyQuery
>;
export type ProfileCarsQueryResult = Apollo.QueryResult<
  ProfileCarsQuery,
  ProfileCarsQueryVariables
>;
export const ProfilesDocument = gql`
  query profiles($userId: Int) {
    profiles(userId: $userId) {
      ...profile
    }
  }
  ${ProfileFragmentDoc}
`;

/**
 * __useProfilesQuery__
 *
 * To run a query within a React component, call `useProfilesQuery` and pass it any options that fit your needs.
 * When your component renders, `useProfilesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProfilesQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useProfilesQuery(
  baseOptions?: Apollo.QueryHookOptions<ProfilesQuery, ProfilesQueryVariables>,
) {
  return Apollo.useQuery<ProfilesQuery, ProfilesQueryVariables>(
    ProfilesDocument,
    baseOptions,
  );
}
export function useProfilesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    ProfilesQuery,
    ProfilesQueryVariables
  >,
) {
  return Apollo.useLazyQuery<ProfilesQuery, ProfilesQueryVariables>(
    ProfilesDocument,
    baseOptions,
  );
}
export type ProfilesQueryHookResult = ReturnType<typeof useProfilesQuery>;
export type ProfilesLazyQueryHookResult = ReturnType<
  typeof useProfilesLazyQuery
>;
export type ProfilesQueryResult = Apollo.QueryResult<
  ProfilesQuery,
  ProfilesQueryVariables
>;
