import React, { FC, useCallback, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
} from 'react-native';
import { COLORS } from '../constants';

export interface Action {
  label: string;
  id: number;
}

interface IExternalProps {
  actions: Array<Action>;
  onSelect?: (action: Action) => void;
  selectedAction?: Action | null;
}

interface IProps extends IExternalProps {}

const SelectButtonGroup: FC<IProps> = ({
  actions,
  onSelect,
  selectedAction,
}) => {
  const [selected, setSelected] = useState<Action | null>(
    selectedAction || null,
  );

  useEffect(() => {
    if (!selectedAction && !selected) {
      setSelected(actions[0]);
    }
  }, [selectedAction, actions]);

  const handleSelect = useCallback(
    (action: Action) => {
      return () => {
        setSelected(action);
        if (onSelect) {
          onSelect(action);
        }
      };
    },
    [actions, onSelect, selected, setSelected],
  );

  const renderActions = useCallback(() => {
    return actions.map((action) => {
      const selectedStyles = selected?.id === action.id && {
        backgroundColor: COLORS.white,
      };
      const styleAction = {
        width: `${100 / actions.length}%`,
        borderRadius: 30,
      };
      const selectedStylesLabel = selected?.id === action.id && {
        color: COLORS.black,
      };

      return (
        <TouchableOpacity
          style={[styles.action, styleAction, selectedStyles]}
          onPress={handleSelect(action)}
          key={action.id}>
          <Text style={[styles.label, selectedStylesLabel]}>
            {action.label}
          </Text>
        </TouchableOpacity>
      );
    });
  }, [actions, selected]);

  return <View style={styles.container}>{renderActions()}</View>;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 1,
    height: 48,
    width: Dimensions.get('screen').width - 40,
    backgroundColor: COLORS.bgColorLight,
    borderRadius: 30,
    borderColor: COLORS.lightGray,
    borderWidth: 1,
  },
  action: {
    backgroundColor: COLORS.transparent,
    height: '100%',
    justifyContent: 'center',
  },
  label: {
    color: COLORS.gray,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SelectButtonGroup;
