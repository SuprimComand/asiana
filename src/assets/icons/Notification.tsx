import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

function NotificationSvg(props: SvgProps) {
  return (
    <Svg width={26} height={26} viewBox="0 0 26 26" fill="none" {...props}>
      <Path
        d="M13 26c1.787 0 3.25-1.2 3.25-2.667h-6.5C9.75 24.8 11.196 26 13 26zm9.75-8v-6.667c0-4.093-2.665-7.52-7.313-8.426V2c0-1.107-1.088-2-2.437-2-1.349 0-2.438.893-2.438 2v.907C5.9 3.813 3.25 7.227 3.25 11.333V18L0 20.667V22h26v-1.333L22.75 18z"
        fill="#E7702B"
      />
    </Svg>
  );
}

export default NotificationSvg;
