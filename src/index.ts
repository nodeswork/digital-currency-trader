import * as _                     from 'underscore';;

import * as kiws                  from '@nodeswork/kiws';
import * as applet                from '@nodeswork/applet';
import { metrics }                from '@nodeswork/utils';

import * as constants             from './constants';
import { AnalysisHandler }        from './handlers';

const METRICS    = constants.metrics;
const DIMENSIONS = constants.metrics.dimensions;

@applet.WorkerProvider({})
class DigitalCurrencyAutoTrader {

  @kiws.Input()  wex:        applet.WEXAccount;
  @kiws.Inject() logger:     applet.ContextLogger;
  @kiws.Inject() execution:  applet.ExecutionMetrics;

  @applet.Worker({
    name:      'Trade',
    schedule:  '0 * * * * *',
    default:   true,
  })
  async trade() {
    const info = await this.wex.getInfo();
    for (const currency in info.funds) {
      await this.execution.updateMetrics({
        name:       METRICS.BALANCE,
        dimensions: metrics.dimensions(
          DIMENSIONS.ACCOUNT, this.wex.name,
          DIMENSIONS.CURRENCY, currency,
        ),
        value:      metrics.Last(info.funds[currency]),
      });
    }
  }
}

@applet.Module({
  workers: [
    DigitalCurrencyAutoTrader,
  ],
  handlers: [
    AnalysisHandler,
  ],
  providers: [
    applet.WEXAccount,
  ],
})
class DigitalCurrencyAutoTraderModule {
}

applet.bootstrap(DigitalCurrencyAutoTraderModule);
