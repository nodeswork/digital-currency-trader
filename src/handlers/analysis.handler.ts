import * as _             from 'underscore';

import * as kiws          from '@nodeswork/kiws';
import { ui }             from '@nodeswork/applet/dist/ui';
import { NodesworkError } from '@nodeswork/utils';

import * as constants     from '../constants';

const METRICS    = constants.metrics;
const DIMENSIONS = constants.metrics.dimensions;

@kiws.Handler({})
export class AnalysisHandler {

  @kiws.Input() ctx: kiws.ContextInput;

  constructor(
  ) { }

  @kiws.Endpoint({ path: '/analysis' })
  async analysis() {

    const balanceGroup: ui.metrics.MetricsPanelGroup = {
      title:             'Account Balance',
      dimensionConfigs:  [
        {
          name:          DIMENSIONS.ACCOUNT,
          filters:       [],
          enabled:       false,
        },
        {
          name:          DIMENSIONS.CURRENCY,
          filters:       [],
          enabled:       false,
        },
      ],
      metricsConfigs:    [
        {
          name:          METRICS.BALANCE,
          source:        'executions',
        },
      ],
      graphs:            [
        {
          title:         'Account Balance',
          width:         2,
          chart:         {
            type:        'lineChart',
          },
          metrics:       [
            {
              name:         METRICS.BALANCE,
              displayName:  'balance',
            },
          ],
        },
      ],
    };

    return {
      rangeSelection:      {
        granularity:       600, // 3600,
        timerange:         {
          start:           - 4 * 3600 * 1000,
          end:             0,
        },
      },
      groups:              [
        balanceGroup,
      ],
    };
  }
}
