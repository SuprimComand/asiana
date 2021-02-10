import React, { FC } from 'react';
import { View, Text } from 'react-native';

interface IExternalProps {}

interface IProps extends IExternalProps {}

const FeedbackItem: FC<IProps> = () => {
  return (
    <View>
      <Text>FeedbackItem</Text>
    </View>
  );
};

export default FeedbackItem;
