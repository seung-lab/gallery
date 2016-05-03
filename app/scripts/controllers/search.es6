'use strict';

app.controller('SearchController', function ($scope, $timeout, $mdSidenav, $mdDialog, $log, $state) {

	var self = this;
	
	var curGCs = [
		{id: '3', name: 'weirdos', neurons: '20248, 17134', wiki: '', description: 'Ganglion Cell Type: weirdos', viewLink: '//set/0/1/3'},
		{id: '4', name: '81', neurons: '20158', wiki: '', description: 'Ganglion Cell Type: 81', viewLink: '//set/0/1/4'},
		{id: '5', name: '9n', neurons: '20076, 20006, 20056, 20112', wiki: '', description: 'Ganglion Cell Type: 9n', viewLink: '//set/0/1/5'},
		{id: '6', name: '37 (vON-OFF DS)', neurons: '20125, 20014, 90002', wiki: '', description: 'Ganglion Cell Type: 37 (vON-OFF DS)', viewLink: '//set/0/1/6'},
		{id: '8', name: '37 (dON-OFF DS)', neurons: '17161, 20137, 20096, 20016, 20233', wiki: '', description: 'Ganglion Cell Type: 37 (dON-OFF DS)', viewLink: '//set/0/1/8'},
		{id: '9', name: '2aw (midi-J)', neurons: '20047, 20201, 17107, 17200, 17205, 17028, 17061, 17060, 17144, 17075, 20103, 26018', wiki: '', description: 'Ganglion Cell Type: 2aw (midi-J)', viewLink: '//set/0/1/9'},
		{id: '10', name: '37 (aON-OFF DS)', neurons: '17080, 25005, 20220, 90001, 20213', wiki: '', description: 'Ganglion Cell Type: 37 (aON-OFF DS)', viewLink: '//set/0/1/10'},
		{id: '11', name: '68', neurons: '20046, 20232, 20113, 20255', wiki: '', description: 'Ganglion Cell Type: 68', viewLink: '//set/0/1/11'},
		{id: '12', name: '83', neurons: '17009, 20197', wiki: '', description: 'Ganglion Cell Type: 83', viewLink: '//set/0/1/12'},
		{id: '13', name: '1no', neurons: '10007, 20157, 17021, 17110, 17236, 20092, 17050, 26024', wiki: '', description: 'Ganglion Cell Type: 1no', viewLink: '//set/0/1/13'},
		{id: '14', name: '1ni', neurons: '20132, 17182, 20164, 26019', wiki: '', description: 'Ganglion Cell Type: 1ni', viewLink: '//set/0/1/14'},
		{id: '15', name: '85', neurons: '20072, 20200, 26061, 17038, 17012, 20063', wiki: '', description: 'Ganglion Cell Type: 85', viewLink: '//set/0/1/15'},
		{id: '16', name: '5ton (LED, w3)', neurons: '20216, 20127, 50002, 17121, 20191, 20226, 20089, 17093, 20055, 20184, 17138, 17090, 17059, 17078, 20262, 17181, 20114, 17159, 17011, 20102, 17190', wiki: '', description: 'Ganglion Cell Type: 5ton (LED, w3)', viewLink: '//set/0/1/16'},
		{id: '17', name: '25', neurons: '20186, 20067, 17132, 20045, 20237, 20036, 25006, 17176, 20104, 20105, 26031', wiki: '', description: 'Ganglion Cell Type: 25', viewLink: '//set/0/1/17'},
		{id: '18', name: '3i (mini-sOFFalpha)', neurons: '20107, 17077, 26063', wiki: '', description: 'Ganglion Cell Type: 3i (mini-sOFFalpha)', viewLink: '//set/0/1/18'},
		{id: '19', name: '27', neurons: '20117, 26051, 26065, 17212', wiki: '', description: 'Ganglion Cell Type: 27', viewLink: '//set/0/1/19'},
		{id: '20', name: '82i', neurons: '26067, 20161, 26058, 20251, 30001', wiki: '', description: 'Ganglion Cell Type: 82i', viewLink: '//set/0/1/20'},
		{id: '22', name: '8w (sONalpha, M4)', neurons: '26001, 17111', wiki: '', description: 'Ganglion Cell Type: 8w (sONalpha, M4)', viewLink: '//set/0/1/22'},
		{id: '23', name: '4on (mini-tOFFalpha)', neurons: '20041, 17034, 20230, 26021, 17167, 17151, 17064', wiki: '', description: 'Ganglion Cell Type: 4on (mini-tOFFalpha)', viewLink: '//set/0/1/23'},
		{id: '24', name: '7o (tON DS)', neurons: '26034, 20075, 17053, 20180', wiki: '', description: 'Ganglion Cell Type: 7o (tON DS)', viewLink: '//set/0/1/24'},
		{id: '25', name: '5ti', neurons: '20183, 20070, 26044, 17055, 17040, 17071, 20135', wiki: '', description: 'Ganglion Cell Type: 5ti', viewLink: '//set/0/1/25'},
		{id: '26', name: '28', neurons: '20155, 20243, 20163, 20257, 20167, 26005, 26033', wiki: '', description: 'Ganglion Cell Type: 28', viewLink: '//set/0/1/26'},
		{id: '27', name: '9w (M2)', neurons: '20228', wiki: '', description: 'Ganglion Cell Type: 9w (M2)', viewLink: '//set/0/1/27'},
		{id: '28', name: '5s', neurons: '20223, 20053, 17081, 20012, 17160, 17146, 17127, 17168', wiki: '', description: 'Ganglion Cell Type: 5s', viewLink: '//set/0/1/28'},
		{id: '29', name: '13 (sOFFalpha)', neurons: '17109, 10018', wiki: '', description: 'Ganglion Cell Type: 13 (sOFFalpha)', viewLink: '//set/0/1/29'},
		{id: '30', name: '1w (M1)', neurons: '20029, 20203', wiki: '', description: 'Ganglion Cell Type: 1w (M1)', viewLink: '//set/0/1/30'},
		{id: '31', name: '72w', neurons: '20221, 20074, 17069, 20166', wiki: '', description: 'Ganglion Cell Type: 72w', viewLink: '//set/0/1/31'},
		{id: '32', name: '3o', neurons: '17024, 20121, 17037, 26038, 26003, 17076, 17135, 17192', wiki: '', description: 'Ganglion Cell Type: 3o', viewLink: '//set/0/1/32'},
		{id: '33', name: '7i (sON DS)', neurons: '20021, 17152, 26070, 26002', wiki: '', description: 'Ganglion Cell Type: 7i (sON DS)', viewLink: '//set/0/1/33'},
		{id: '35', name: '82w', neurons: '20118', wiki: '', description: 'Ganglion Cell Type: 82w', viewLink: '//set/0/1/35'},
		{id: '37', name: '8n', neurons: '20126', wiki: '', description: 'Ganglion Cell Type: 8n', viewLink: '//set/0/1/37'},
		{id: '40', name: '82o', neurons: '26052, 20069, 20080', wiki: '', description: 'Ganglion Cell Type: 82o', viewLink: '//set/0/1/40'},
		{id: '42', name: '6n (mini-tONalpha)', neurons: '26035, 26043, 17082, 20198, 20073', wiki: '', description: 'Ganglion Cell Type: 6n (mini-tONalpha)', viewLink: '//set/0/1/42'},
		{id: '45', name: '63', neurons: '20140, 17114, 30002, 30003, 20178, 20071, 20181, 20208, 20129, 20011, 20005, 17097, 20019, 17140, 26057, 17084', wiki: '', description: 'Ganglion Cell Type: 63', viewLink: '//set/0/1/45'},
		{id: '46', name: '91n', neurons: '20042, 20218, 25003', wiki: '', description: 'Ganglion Cell Type: 91n', viewLink: '//set/0/1/46'},
		{id: '48', name: '4ow (tOFFalpha)', neurons: '17188, 26004, 17079, 20156', wiki: '', description: 'Ganglion Cell Type: 4ow (tOFFalpha)', viewLink: '//set/0/1/48'},
		{id: '50', name: '2i', neurons: '50004, 20234, 20051, 20082, 17092, 17013', wiki: '', description: 'Ganglion Cell Type: 2i', viewLink: '//set/0/1/50'},
		{id: '51', name: '72n', neurons: '20043, 20187, 26059, 20100, 20150', wiki: '', description: 'Ganglion Cell Type: 72n', viewLink: '//set/0/1/51'},
		{id: '53', name: '51 (LED, w3)', neurons: '20153, 20212, 20182, 20258, 20097, 17095, 20120, 17098, 20037, 17035', wiki: '', description: 'Ganglion Cell Type: 51 (LED, w3)', viewLink: '//set/0/1/53'},
		{id: '54', name: '4i', neurons: '25004, 17022, 20174, 20170, 17057, 26006, 17247, 26050, 26008', wiki: '', description: 'Ganglion Cell Type: 4i', viewLink: '//set/0/1/54'},
		{id: '55', name: '5tow', neurons: '20240, 20128, 20165', wiki: '', description: 'Ganglion Cell Type: 5tow', viewLink: '//set/0/1/55'},
		{id: '56', name: '91w', neurons: '20020, 20081', wiki: '', description: 'Ganglion Cell Type: 91w', viewLink: '//set/0/1/56'},
		{id: '57', name: '2o', neurons: '10013, 10005, 17216, 26062', wiki: '', description: 'Ganglion Cell Type: 2o', viewLink: '//set/0/1/57'},
		{id: '59', name: '37 (pON-OFF DS)', neurons: '20179, 20210, 20245, 20254, 20002, 20239', wiki: '', description: 'Ganglion Cell Type: 37 (pON-OFF DS)', viewLink: '//set/0/1/59'},
		{id: '60', name: '6w (tONalpha)', neurons: '20222, 17083, 26020, 20068, 20217', wiki: '', description: 'Ganglion Cell Type: 6w (tONalpha)', viewLink: '//set/0/1/60'},
		{id: '61', name: '2an (mini-J)', neurons: '17027, 50001, 20101, 20066, 20060, 20168, 20024, 17062, 17177, 15066, 15018, 17130, 20147, 10010, 10017, 20264, 17105', wiki: '', description: 'Ganglion Cell Type: 2an (mini-J)', viewLink: '//set/0/1/61'}
	];
	var curBCs = [
		{id: '41', name: 'bc1 (NK3R+ & Syt2-)', neurons: '60052, 60132, 60204, 60203, 60139, 60118, 60078, 60079, 60032, 60150, 60111, 60110, 60114, 60055, 60158, 60187, 60184, 60188, 60189, 60212, 60213, 60216, 60129, 60218, 60147, 60027, 60109, 60142, 60164, 60008, 60161, 60162, 60105, 60026, 60195, 60194, 60196, 60177, 60170, 60099, 60019', wiki: '', description: 'Bipolar Cell Type: bc1 (NK3R+ & Syt2-)', viewLink: '//set/0/2/41'},
		{id: '43', name: 'bc2 (NK3R+ & Syt2+, recoverin, Neto1,Cdh8)', neurons: '60135, 60133, 60140, 60130, 60209, 60208, 60004, 60223, 60221, 60138, 60037, 60157, 60124, 60112, 60010, 60011, 60038, 60039, 60167, 60214, 60159, 60217, 60182, 60012, 60226, 60013, 60219, 60120, 60046, 60210, 60044, 60043, 60042, 60041, 60040, 60080, 60025, 60002, 60001, 60021, 60006, 60023, 60022, 60102, 60103, 60009, 60101, 60029, 60104, 60149, 60003, 60141, 60224, 60097, 60169', wiki: 'BC2', description: 'Bipolar Cell Type: bc2 (NK3R+ & Syt2+, recoverin, Neto1, Cdh8)', viewLink: '//set/0/2/43'},
		{id: '44', name: 'bc3b (PKARIIbeta)', neurons: '60201, 60053, 60131, 60057, 60122, 60173, 60154, 60156, 60151, 60153, 60073, 60179, 60178, 60077, 60074, 60228, 60045, 60211, 60215, 60082, 60087, 60084, 60069, 60024, 60165, 60063, 60106, 60107, 60148, 60094, 60190, 60096, 60090, 60098', wiki: '', description: 'Bipolar Cell Type: bc3b (PKARIIbeta)', viewLink: '//set/0/2/44'},
		{id: '49', name: 'bc5t (?)', neurons: '60543, 60527, 60054, 60481, 60155, 60403, 60387, 60366, 60507, 60502, 60503, 60408, 60465, 60445, 60448, 60469, 60399, 60411, 60395, 60538, 60533, 60371, 60535, 60436, 60452', wiki: '', description: 'Bipolar Cell Type: bc5t (?)', viewLink: '//set/0/2/49'},
		{id: '47', name: 'bc5o (5-HT3R-EGFP, Kcng4, Cdh9)', neurons: '60540, 60484, 60406, 60405, 60018, 60364, 60473, 60440, 60447, 60420, 60608, 60559, 60556, 60490, 60495, 60466, 60390, 60061, 60532, 60064, 60513, 60534, 60612, 60459, 60432, 60071, 60434, 60453', wiki: '', description: 'Bipolar Cell Type: bc5o (5-HT3R-EGFP,Kcng4,Cdh9)', viewLink: '//set/0/2/47'},
		{id: '7', name: 'bc3a (HCN4)', neurons: '60050, 60136, 60134, 60056, 60059, 60137, 60172, 60123, 60176, 60030, 60072, 60115, 60075, 60076, 60181, 60088, 60049, 60048, 60146, 60068, 60108, 60145, 60085, 60166, 60028, 60066, 60092, 60093', wiki: '', description: 'Bipolar Cell Type: bc3a (HCN4)', viewLink: '//set/0/2/7'},
		{id: '52', name: 'bc4 (Csen)', neurons: '60202, 60206, 60058, 60222, 60220, 60119, 60171, 60175, 60174, 60117, 60116, 60183, 60186, 60185, 60047, 60121, 60089, 60125, 60127, 60083, 60086, 60144, 60168, 60143, 60100, 60160, 60067, 60163, 60191, 60095, 60091, 60197, 60199', wiki: '', description: 'Bipolar Cell Type: bc4 (Csen)', viewLink: '//set/0/2/52'},
		{id: '36', name: 'bc5i', neurons: '60542, 60541, 60522, 60488, 60528, 60380, 60383, 60033, 60386, 60514, 60388, 60389, 60504, 60505, 60360, 60442, 60621, 60620, 60460, 60462, 60421, 60523, 60618, 60498, 60491, 60497, 60410, 60615, 60414, 60415, 60374, 60510, 60617, 60439, 60458, 60450, 60478, 60619, 60404, 60519, 60020', wiki: '', description: 'Bipolar Cell Type: bc5i (5-HT3R-EGFP, Kcng4, Cdh9)', viewLink: '//set/0/2/36'},
		{id: '38', name: 'xbc (?)', neurons: '60550, 60547, 60455, 60449, 60493, 60539, 60413, 60379, 60517, 60430, 60355, 60501', wiki: '', description: 'Bipolar Cell Type: xbc (?)', viewLink: '//set/0/2/38'},
		{id: '39', name: 'bc7 (Gus-GFP)', neurons: '60051, 60546, 60525, 60485, 60529, 60480, 60508, 60509, 60016, 60531, 60361, 60429, 60446, 60562, 60553, 60492, 60397, 60396, 60412, 60393, 60418, 60377, 60376, 60373, 60354, 60470, 60454, 60437, 60435', wiki: '', description: 'Bipolar Cell Type: bc7 (Gus-GFP)', viewLink: '//set/0/2/39'},
		{id: '21', name: 'bc6 (Syt2)', neurons: '60526, 60489, 60487, 60486, 60548, 60549, 60483, 60407, 60381, 60401, 60419, 60363, 60409, 60443, 60428, 60467, 60530, 60444, 60423, 60422, 60425, 60426, 60561, 60398, 60499, 60552, 60554, 60464, 60370, 60441, 60496, 60394, 60416, 60375, 60060, 60036, 60516, 60537, 60356, 60512, 60476, 60477, 60614, 60611, 60431, 60451, 60358', wiki: '', description: 'Bipolar Cell Type: bc6 (Syt2)', viewLink: '//set/0/2/21'},
		{id: '34', name: 'bc8/9 (?/Clm1)', neurons: '60438, 60461, 60578, 60433, 60457, 60482, 60402, 60368, 60417, 60500', wiki: '', description: 'Bipolar Cell Type: bc8/9 (?/Clm1)', viewLink: '//set/0/2/34'},
		{id: '58', name: 'rbc', neurons: '60568, 60569, 60031, 60520, 60521, 60544, 60560, 60369, 60564, 60565, 60566, 60567, 60382, 60384, 60427, 60400, 60506, 60365, 60600, 60586, 60587, 60584, 60585, 60582, 60583, 60463, 60581, 60610, 60609, 60468, 60588, 60589, 60601, 60392, 60576, 60613, 60603, 60606, 60590, 60551, 60605, 60563, 60555, 60557, 60604, 60577, 60558, 60575, 60574, 60573, 60572, 60571, 60570, 60359, 60596, 60518, 60515, 60591, 60357, 60536, 60372, 60595, 60594, 60474, 60475, 60472, 60580, 60593, 60471, 60017, 60456, 60592, 60599, 60598, 60479, 60597, 60602, 60607, 60378', wiki: '', description: 'Bipolar Cell Type: rbc', viewLink: '//set/0/2/58'}
	];

	 /**
	 * Build `states` list of key/value pairs
	 */
	function loadAllAutocompletes () {
		let cards = allCards();

		let choices = [];

		for (card of cards) {
			choices.push(card.name);
			choices.push(card.description);

			choices.push.apply(choices, card.neurons.split(/ ?, ?/));
		}

		choices.sort();
	 
		return choices.map(function (state) {
			return {
				value: state.toLowerCase(),
				display: state,
			};
		})
	}

	function allCards () {
		return curGCs.concat(curBCs);
	}

	/**
	 * Populates the autocomplete list shown
	 */
	function querySearch (query) {
		query = query || "";
		query = query.toLowerCase();

		var results = query 
			? self.states.filter(function (state) {
					return state.value.toLowerCase().indexOf(query) > -1;
				})
			: self.states;

		return results;
	}

	function search (text) {
		let base_cards = baseCards();

		if (!text.length) {
			return base_cards;
		}

		let cards = [];

		let queryText = text.toLowerCase();
		for (let i = 0; i < base_cards.length; i++) {
			let card = base_cards[i];
			 	
			if (card.name.toLowerCase().indexOf(queryText) > -1 
				|| card.neurons.toLowerCase().indexOf(queryText) > -1
				|| card.description.toLowerCase().indexOf(queryText) > -1){

				cards.push(base_cards[i]);
			}
		}

		return cards;
	}

	function searchTextChange (text) {
		text = text || "";
		$scope.txt = text.toLowerCase();
		
		generateCards();
	}

	function selectedItemChange (item) {
		$scope.txt = item 
			? item.value.toLowerCase()
			: "";

		generateCards();
	}

	$scope.cards = allCards();
	$scope.txt = '';
	$scope.data = {
		show_bipolars: true,
		show_ganglia: true,
	};

	function baseCards () {
		let cards = [];

		if ($scope.data.show_ganglia) {
			cards = cards.concat(curGCs);
		}

		if ($scope.data.show_bipolars) {
			cards = cards.concat(curBCs);
		}

		return cards;
	}

	function generateCards () {
		if ($scope.txt) {
			$scope.cards = search($scope.txt);	
		}
		else {
			$scope.cards = baseCards();
		}
	}

	$scope.$watch( (scope) => scope.data.show_ganglia, function () {
		generateCards();
	});

	$scope.$watch( (scope) => scope.data.show_bipolars, function () {
		generateCards();
	});

	$scope.isDisabled = false;
	// list of `state` value/display objects
	this.states = loadAllAutocompletes();
	$scope.querySearch = querySearch;
	$scope.selectedItemChange = selectedItemChange;
	$scope.searchTextChange = searchTextChange;
});








