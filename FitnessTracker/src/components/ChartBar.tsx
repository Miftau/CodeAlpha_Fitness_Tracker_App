import React from 'react';
import { View, Text } from 'react-native';
import { Svg, Rect, G, Text as SvgText } from 'react-native-svg';
import { useColorScheme } from 'react-native';

interface BarData {
  label: string;
  value: number;
  max: number;
}

interface Props {
  data: BarData[];
  height?: number;
  width?: number;
}

export default function ChartBar({ data, height = 120, width = 280 }: Props) {
  const isDark = useColorScheme() === 'dark';
  const barWidth = (width - (data.length - 1) * 8) / data.length;
  const padding = 20;

  return (
    <View style={{ alignItems: 'center' }}>
      <Svg height={height} width={width}>
        <G y={height - padding}>
          {data.map((item, i) => {
            const x = i * (barWidth + 8);
            const barHeight = (item.value / item.max) * (height - padding - 20);
            return (
              <React.Fragment key={i}>
                <Rect
                  x={x}
                  y={-barHeight}
                  width={barWidth}
                  height={barHeight}
                  fill={isDark ? '#3b82f6' : '#60a5fa'}
                  rx="4"
                />
                <SvgText
                  x={x + barWidth / 2}
                  y={-barHeight - 8}
                  fontSize="10"
                  fill={isDark ? '#f1f5f9' : '#475569'}
                  textAnchor="middle"
                >
                  {Math.round(item.value)}
                </SvgText>
              </React.Fragment>
            );
          })}
        </G>
        {/* X-axis labels */}
        <G y={height - 10}>
          {data.map((item, i) => {
            const x = i * (barWidth + 8) + barWidth / 2;
            return (
              <SvgText
                key={i}
                x={x}
                y={height - 5}
                fontSize="10"
                fill={isDark ? '#94a3b8' : '#64748b'}
                textAnchor="middle"
              >
                {item.label}
              </SvgText>
            );
          })}
        </G>
      </Svg>
    </View>
  );
}