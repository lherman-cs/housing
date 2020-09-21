import React from 'react';
import {ResponsiveLine, Serie} from '@nivo/line';
import {InputDialogData} from './InputDialog';
import {State, calculateDefault} from '../api/math';

const DEFAULT_YEARS = 30;

export type NetWorthTrendlineProps = {
  data: InputDialogData[],
  years?: number
}

function transform(data: InputDialogData, years: number): Serie {
  const months = 12 * years;
  const it = calculateDefault(data, months)
  const states: State[] = [];

  for (let month = 1; month <= months; month++) {
    const result = it.next();
    if (result.done) {
      break;
    }

    if (month % 12 === 0) {
      states.push(result.value);
    }
  }

  const serie: Serie = {
    id: data.label,
    data: states.map((state, i) => ({
      x: i + 1,
      y: state.netWorth,
    }))
  }

  return serie;
}

export function NetWorthTrendline({data, years}: NetWorthTrendlineProps) {
  if (!years) {
    years = DEFAULT_YEARS;
  }

  return (
    <ResponsiveLine
      data={data.map(datum => transform(datum, years!))}
      margin={{top: 50, right: 110, bottom: 50, left: 80}}
      xScale={{type: 'point'}}
      yScale={{type: 'linear', min: 'auto', max: 'auto', stacked: false, reverse: false}}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        orient: 'bottom',
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'Years',
        legendOffset: 36,
        legendPosition: 'middle'
      }}
      axisLeft={{
        orient: 'left',
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'Net Worth',
        legendOffset: -70,
        legendPosition: 'middle'
      }}
      colors={{scheme: 'nivo'}}
      pointSize={10}
      pointColor={{theme: 'background'}}
      pointBorderWidth={2}
      pointBorderColor={{from: 'serieColor'}}
      pointLabel="y"
      pointLabelYOffset={-12}
      useMesh={true}
      legends={[
        {
          anchor: 'bottom-right',
          direction: 'column',
          justify: false,
          translateX: 100,
          translateY: 0,
          itemsSpacing: 0,
          itemDirection: 'left-to-right',
          itemWidth: 80,
          itemHeight: 20,
          itemOpacity: 0.75,
          symbolSize: 12,
          symbolShape: 'circle',
          symbolBorderColor: 'rgba(0, 0, 0, .5)',
          effects: [
            {
              on: 'hover',
              style: {
                itemBackground: 'rgba(0, 0, 0, .03)',
                itemOpacity: 1
              }
            }
          ]
        }
      ]}
    />);
}
