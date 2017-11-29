var oxr = require('open-exchange-rates'),
	fx = require('money');

oxr.set({ app_id: 'bb201075b92641cca8cf4e2b0cc8c765' })

oxr.latest(function() {
	// Apply exchange rates and base rate to `fx` library object:
	fx.rates = oxr.rates;
	fx.base = oxr.base;
	
	// money.js is ready to use:
	fx(100).from('HKD').to('GBP'); // ~8.0424
});