'use strict';

app.controller('SearchController', function ($scope, $timeout, $mdSidenav, $mdDialog, $log, $state) {

	 /**
	 * Build `states` list of key/value pairs
	 */
	function loadAll () {

		var allChoices = '10005,10007,10010,10013,10015,10017,10018,13 (sOFFalpha),15018,15066,17009,17011,17012,17013,17021,17022,17024,17027,17028,17034,17035,17037,17038,17040,17050,17051,17053,17055,17057,17059,17060,17061,17062,17064,17069,17071,17075,17076,17077,17078,17079,17080,17081,17082,17083,17084,17090,17092,17093,17095,17097,17098,17105,17107,17109,17110,17111,17114,17121,17127,17130,17132,17134,17135,17138,17140,17144,17146,17151,17152,17159,17160,17161,17167,17168,17176,17177,17181,17182,17188,17190,17192,17200,17205,17212,17216,17236,17238,17247,1ni,1no,1w (M1),20001,20002,20003,20004,20005,20006,20007,20008,20009,20010,20011,20012,20013,20014,20015,20016,20017,20018,20019,20020,20021,20022,20023,20024,20025,20026,20027,20028,20029,20030,20031,20032,20033,20034,20035,20036,20037,20038,20039,20040,20041,20042,20043,20044,20045,20046,20047,20048,20049,20050,20051,20052,20053,20054,20055,20056,20057,20058,20059,20060,20061,20062,20063,20064,20065,20066,20067,20068,20069,20070,20071,20072,20073,20074,20075,20076,20077,20078,20079,20080,20081,20082,20083,20084,20085,20086,20087,20088,20089,20090,20091,20092,20093,20094,20095,20096,20097,20098,20099,20100,20101,20102,20103,20104,20105,20106,20107,20108,20109,20110,20111,20112,20113,20114,20115,20116,20117,20118,20119,20120,20121,20122,20123,20124,20125,20126,20127,20128,20129,20130,20131,20132,20133,20134,20135,20136,20137,20138,20139,20140,20141,20142,20143,20144,20145,20146,20147,20148,20149,20150,20151,20152,20153,20154,20155,20156,20157,20158,20159,20160,20161,20162,20163,20164,20165,20166,20167,20168,20169,20170,20171,20172,20173,20174,20175,20176,20177,20178,20179,20180,20181,20182,20183,20184,20185,20186,20187,20188,20189,20190,20191,20192,20193,20194,20195,20196,20197,20198,20199,20200,20201,20202,20203,20204,20205,20206,20207,20208,20209,20210,20211,20212,20213,20214,20215,20216,20217,20218,20219,20220,20221,20222,20223,20224,20225,20226,20227,20228,20229,20230,20231,20232,20233,20234,20235,20236,20237,20238,20239,20240,20241,20242,20243,20244,20245,20246,20247,20248,20249,20250,20251,20252,20253,20254,20255,20256,20257,20258,20259,20260,20261,20262,20263,20264,20265,20266,20267,25,25001,25002,25003,25004,25005,25006,25008,26001,26002,26003,26004,26005,26006,26007,26008,26009,26010,26011,26012,26013,26014,26015,26016,26017,26018,26019,26020,26021,26022,26023,26024,26025,26026,26027,26028,26029,26030,26031,26032,26033,26034,26035,26036,26037,26038,26039,26040,26041,26042,26043,26044,26045,26046,26047,26048,26049,26050,26051,26052,26053,26054,26055,26056,26057,26058,26059,26060,26061,26062,26063,26064,26065,26066,26067,26068,27,28,2an (mini-J),2aw (midi-J),2i,2o,30001,30002,30003,30004,30005,37 (aON-OFF DS),37 (dON-OFF DS),37 (pON-OFF DS),37 (vON-OFF DS),3i (mini-sOFFalpha),3o,4i,4on (mini-tOFFalpha),4ow (tOFFalpha),50001,50002,50004,51 (LED, w3),5s,5ti,5ton (LED, w3),5tow,60001,60002,60003,60004,60005,60006,60007,60008,60009,60010,60011,60012,60013,60014,60015,60016,60017,60018,60019,60020,60021,60022,60023,60024,60025,60026,60027,60028,60029,60030,60031,60032,60033,60034,60035,60036,60037,60038,60039,60040,60041,60042,60043,60044,60045,60046,60047,60048,60049,60050,60051,60052,60053,60054,60055,60056,60057,60058,60059,60060,60061,60062,60063,60064,60065,60066,60067,60068,60069,60070,60071,60072,60073,60074,60075,60076,60077,60078,60079,60080,60081,60082,60083,60084,60085,60086,60087,60088,60089,60090,60091,60092,60093,60094,60095,60096,60097,60098,60099,60100,60101,60102,60103,60104,60105,60106,60107,60108,60109,60110,60111,60112,60113,60114,60115,60116,60117,60118,60119,60120,60121,60122,60123,60124,60125,60126,60127,60128,60129,60130,60131,60132,60133,60134,60135,60136,60137,60138,60139,60140,60141,60142,60143,60144,60145,60146,60147,60148,60149,60150,60151,60152,60153,60154,60155,60156,60157,60158,60159,60160,60161,60162,60163,60164,60165,60166,60167,60168,60169,60170,60171,60172,60173,60174,60175,60176,60177,60178,60179,60180,60181,60182,60183,60184,60185,60186,60187,60188,60189,60190,60191,60192,60193,60194,60195,60196,60197,60198,60199,60200,60201,60202,60203,60204,60205,60206,60207,60208,60209,60210,60211,60212,60213,60214,60215,60216,60217,60218,60219,60220,60221,60222,60223,60224,60225,60226,60227,60228,60230,60231,60232,60233,60234,60235,60236,60237,60238,60239,60240,60241,60242,60243,60244,60245,60246,60247,60248,60249,60250,60251,60252,60253,60254,60255,60256,60257,60258,60259,60260,60261,60262,60263,60264,60265,60266,60267,60268,60269,60270,60271,60272,60273,60274,60275,60276,60277,60278,60279,60280,60281,60282,60283,60284,60285,60286,60287,60288,60289,60290,60291,60292,60293,60294,60295,60296,60297,60298,60299,60300,60301,60302,60303,60305,60306,60307,60308,60309,60310,60311,60312,60313,60314,60315,60316,60317,60318,60319,60320,60321,60322,60323,60324,60325,60326,60327,60328,60329,60330,60331,60332,60333,60334,60335,60336,60337,60338,60339,60340,60341,60342,60343,60344,60345,60346,60347,60348,60349,60350,60351,60353,60354,60355,60356,60357,60358,60359,60360,60361,60363,60364,60365,60366,60368,60369,60370,60371,60372,60373,60374,60375,60376,60377,60378,60379,60380,60381,60382,60383,60384,60386,60387,60388,60389,60390,60392,60393,60394,60395,60396,60397,60398,60399,60400,60401,60402,60403,60404,60405,60406,60407,60408,60409,60410,60411,60412,60413,60414,60415,60416,60417,60418,60419,60420,60421,60422,60423,60425,60426,60427,60428,60429,60430,60431,60432,60433,60434,60435,60436,60437,60438,60439,60440,60441,60442,60443,60444,60445,60446,60447,60448,60449,60450,60451,60452,60453,60454,60455,60456,60457,60458,60459,60460,60461,60462,60463,60464,60465,60466,60467,60468,60469,60470,60471,60472,60473,60474,60475,60476,60477,60478,60479,60480,60481,60482,60483,60484,60485,60486,60487,60488,60489,60490,60491,60492,60493,60494,60495,60496,60497,60498,60499,60500,60501,60502,60503,60504,60505,60506,60507,60508,60509,60510,60511,60512,60513,60514,60515,60516,60517,60518,60519,60520,60521,60522,60523,60525,60526,60527,60528,60529,60530,60531,60532,60533,60534,60535,60536,60537,60538,60539,60540,60541,60542,60543,60544,60546,60547,60548,60549,60550,60551,60552,60553,60554,60555,60556,60557,60558,60559,60560,60561,60562,60563,60564,60565,60566,60567,60568,60569,60570,60571,60572,60573,60574,60575,60576,60577,60578,60579,60580,60581,60582,60583,60584,60585,60586,60587,60588,60589,60590,60591,60592,60593,60594,60595,60596,60597,60598,60599,60600,60601,60602,60603,60604,60605,60606,60607,60608,60609,60610,60611,60612,60613,60614,60615,60617,60618,60619,60620,60621,63,68,6n (mini-tONalpha),6w (tONalpha),70001,70002,70003,70004,70005,70006,70007,70008,70009,70010,70011,70012,70013,70014,70015,70016,70017,70018,70019,70020,70021,70022,70023,70024,70025,70026,70027,70028,70029,70030,70031,70032,70033,70034,70035,70036,70037,70038,70039,70040,70041,70042,70043,70044,70045,70046,70047,70048,70049,70050,70051,70052,70053,70054,70055,70056,70057,70058,70059,70060,70061,70062,70063,70064,70065,70066,70067,70068,70069,70070,70071,70072,70073,70074,70075,70076,70077,70078,70079,70080,70081,70082,70083,70084,70085,70086,70087,70088,70089,70090,70091,70092,70093,70094,70095,70096,70097,70098,70099,70100,70101,70102,70103,70104,70105,70106,70107,70108,70109,70110,70111,70112,70113,70114,70115,70116,70117,70118,70119,70120,70121,70122,70123,70124,70125,70126,70127,70128,70129,70130,70131,70132,70133,70134,70135,70136,70137,70138,70139,70140,70141,70142,70143,70144,70145,70146,70147,70148,70149,70150,70151,70152,70153,70154,70155,70156,70157,70158,70159,70160,70161,70162,70163,70164,70165,70166,70167,70168,70169,70170,70171,70172,70173,70174,70175,70176,70177,70178,70179,70180,70181,70182,70183,70184,70185,70186,70187,70188,70189,70190,70191,70192,70193,70194,70195,70196,70197,70198,70199,70200,70201,70202,70203,70204,70205,70206,70207,70208,70209,70211,70212,70213,70214,70215,70216,70217,70218,70219,70220,70221,70222,70223,70224,70225,70227,70228,70229,70230,70231,70232,70233,70234,70235,70236,70237,70238,70239,70240,70241,70242,70243,70244,72n,72w,7i (sON DS),7o (tON DS),81,82i,82o,82w,83,85,8n,8w (sONalpha, M4),90001,90002,91n,91w,99999,9n,9w (M2),bc1 (NK3R+ & Syt2-),bc2 (NK3R+ & Syt2+,recoverin,Neto1,Cdh8),bc3a (HCN4),bc3b (PKARIIbeta),bc4 (Csen),bc5i (5-HT3R-EGFP,Kcng4,Cdh9),bc5o (5-HT3R-EGFP,Kcng4,Cdh9),bc5t (?),bc6 (Syt2),bc7 (Gus-GFP),bc8/9 (?/Clm1),rbc,weirdos,xbc (?)';
	 
		return allChoices
			.split(',')
			.map( (state) => {
				return {
					value: state.toLowerCase(),
					display: state,
				};
			});
	}

	/**
	 * Search for states... use $timeout to simulate
	 * remote dataservice call.
	 */
	function querySearch (query) {
		
		var results = query 
		? self.states.filter(function (state) {
				var lowercaseQuery = angular.lowercase(query);
				return state.value.indexOf(lowercaseQuery) === 0;
			})
		: self.states;

		return results;
	}

	function searchTextChange (text) {
		if (text.length < $scope.querySize) {
			$scope.cards = allCards;
		}

		curBCs = [];
		curGCs = [];
		
		var queryText = text.toLowerCase();
		for (var i = 0; i < $scope.cards.length; i++) {
			var cardName = $scope.cards[i].name.toLowerCase();
			var cardNeurons = $scope.cards[i].neurons;
			
			if (cardName.indexOf(queryText) > -1 || cardNeurons.indexOf(queryText) > -1){
				if(bcIDs.indexOf(',' + $scope.cards[i].id + ',') > -1) {
					curBCs.push($scope.cards[i]);
				}
				else {
					curGCs.push($scope.cards[i]); 
				}
			}
		}

		if (showBCs && showGCs) {
			$scope.cards = curGCs.concat(curBCs);
		}
		else if (showBCs) {
			$scope.cards = curBCs;
		}
		else if (showGCs) {
			$scope.cards = curGCs;
		}
		else {
			$scope.cards = [];
		}
		
		$scope.querySize = text.length;
		$scope.txt = text;
	}

	function selectedItemChange (item) {
		var placeholder = [];
		var queryText = item.value;
		for (var i = 0; i < $scope.cards.length; i++) {
			
			var cardName = $scope.cards[i].name.toLowerCase();
			var cardNeurons = $scope.cards[i].neurons;
			
			if (cardName.indexOf(queryText) > -1 || cardNeurons.indexOf(queryText) > -1){
				placeholder.push($scope.cards[i]); 
			}
		}
		$scope.cards = placeholder;
		
		$scope.txt = queryText;
	}
	
	var allCards = [
		// {id: '1', name: 'bc1 (NK3R+ & Syt2-)', wiki: 'http://54.88.64.197/index.php?title=Starburst_Amacrine_Cell' , description: "Some brief description of what this subclass is so people have a bit more context.", viewLink: "//set/0/2/41"},
		// {id: '2', name: 'bc2 (NK3R+ & Syt2+, recoverin, Neto1, Cdh8)', wiki: 'http://54.88.64.197/index.php?title=Starburst_Amacrine_Cell' , description: "Some brief description of what this subclass is so people have a bit more context.", viewLink: "//set/0/2/43"},
		// {id: '3', name: 'bc3a (HCN4)', wiki: 'http://54.88.64.197/index.php?title=Starburst_Amacrine_Cell' , description: "Some brief description of what this subclass is so people have a bit more context.", viewLink: "//set/0/2/7"},
		// {id: '14', name: 'bc4 (Csen)', wiki: 'http://54.88.64.197/index.php?title=Starburst_Amacrine_Cell' , description: "Some brief description of what this subclass is so people have a bit more context.", viewLink: "//set/0/2/52"},
		// {id: '24', name: 'bc5i (5-HT3R-EGFP, Kcng4, Cdh9)', wiki: 'http://54.88.64.197/index.php?title=Starburst_Amacrine_Cell' , description: "Some brief description of what this subclass is so people have a bit more context.", viewLink: "//set/0/2/49"},
		// {id: '34', name: 'bc6 (Syt2)', wiki: '' , description: "Some brief description of what this subclass is so people have a bit more context.", viewLink: "//set/0/2/21"}

		// {id: '0', name: 'Sets', neurons: '1, 2', wiki: '', description: '', viewLink: ''},
		// {id: '1', name: 'GC', neurons: '29, 30, 13, 14, 17, 61, 9, 57, 50, 32, 18, 23, 48, 54, 53, 16, 55, 25, 28, 42, 60, 33, 24, 37, 22, 27, 5, 10, 6, 59, 8, 45, 11, 51, 19, 31, 26, 4, 35, 40, 20, 12, 15, 46, 56, 3', wiki: '', description: '', viewLink: ''},
		// {id: '2', name: 'BC', neurons: '41, 43, 7, 44, 52, 49, 47, 36, 38, 21, 39, 34, 58', wiki: '', description: '', viewLink: ''},
		{id: '3', name: 'weirdos', neurons: [20248, 17134], wiki: '', description: 'Ganglion Cell Type: weirdos', viewLink: '//set/0/1/3'},
		{id: '4', name: '81', neurons: '20158', wiki: '', description: 'Ganglion Cell Type: 81', viewLink: '//set/0/1/4'},
		{id: '5', name: '9n', neurons: '20076, 20006, 20056, 20112', wiki: '', description: 'Ganglion Cell Type: 9n', viewLink: '//set/0/1/5'},
		{id: '6', name: '37 (vON-OFF DS)', neurons: '20125, 20014, 90002', wiki: '', description: 'Ganglion Cell Type: 37 (vON-OFF DS)', viewLink: '//set/0/1/6'},
		{id: '7', name: 'bc3a (HCN4)', neurons: '60050, 60136, 60134, 60056, 60059, 60137, 60172, 60123, 60176, 60030, 60072, 60115, 60075, 60076, 60181, 60088, 60049, 60048, 60146, 60068, 60108, 60145, 60085, 60166, 60028, 60066, 60092, 60093', wiki: '', description: 'Bipolar Cell Type: bc3a (HCN4)', viewLink: '//set/0/2/7'},
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
		{id: '21', name: 'bc6 (Syt2)', neurons: '60526, 60489, 60487, 60486, 60548, 60549, 60483, 60407, 60381, 60401, 60419, 60363, 60409, 60443, 60428, 60467, 60530, 60444, 60423, 60422, 60425, 60426, 60561, 60398, 60499, 60552, 60554, 60464, 60370, 60441, 60496, 60394, 60416, 60375, 60060, 60036, 60516, 60537, 60356, 60512, 60476, 60477, 60614, 60611, 60431, 60451, 60358', wiki: '', description: 'Bipolar Cell Type: bc6 (Syt2)', viewLink: '//set/0/2/21'},
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
		{id: '34', name: 'bc8/9 (?/Clm1)', neurons: '60438, 60461, 60578, 60433, 60457, 60482, 60402, 60368, 60417, 60500', wiki: '', description: 'Bipolar Cell Type: bc8/9 (?/Clm1)', viewLink: '//set/0/2/34'},
		{id: '35', name: '82w', neurons: '20118', wiki: '', description: 'Ganglion Cell Type: 82w', viewLink: '//set/0/1/35'},
		{id: '36', name: 'bc5i', neurons: '60542, 60541, 60522, 60488, 60528, 60380, 60383, 60033, 60386, 60514, 60388, 60389, 60504, 60505, 60360, 60442, 60621, 60620, 60460, 60462, 60421, 60523, 60618, 60498, 60491, 60497, 60410, 60615, 60414, 60415, 60374, 60510, 60617, 60439, 60458, 60450, 60478, 60619, 60404, 60519, 60020', wiki: '', description: 'Bipolar Cell Type: bc5i (5-HT3R-EGFP, Kcng4, Cdh9)', viewLink: '//set/0/2/36'},
		{id: '37', name: '8n', neurons: '20126', wiki: '', description: 'Ganglion Cell Type: 8n', viewLink: '//set/0/1/37'},
		{id: '38', name: 'xbc (?)', neurons: '60550, 60547, 60455, 60449, 60493, 60539, 60413, 60379, 60517, 60430, 60355, 60501', wiki: '', description: 'Bipolar Cell Type: xbc (?)', viewLink: '//set/0/2/38'},
		{id: '39', name: 'bc7 (Gus-GFP)', neurons: '60051, 60546, 60525, 60485, 60529, 60480, 60508, 60509, 60016, 60531, 60361, 60429, 60446, 60562, 60553, 60492, 60397, 60396, 60412, 60393, 60418, 60377, 60376, 60373, 60354, 60470, 60454, 60437, 60435', wiki: '', description: 'Bipolar Cell Type: bc7 (Gus-GFP)', viewLink: '//set/0/2/39'},
		{id: '40', name: '82o', neurons: '26052, 20069, 20080', wiki: '', description: 'Ganglion Cell Type: 82o', viewLink: '//set/0/1/40'},
		{id: '41', name: 'bc1 (NK3R+ & Syt2-)', neurons: '60052, 60132, 60204, 60203, 60139, 60118, 60078, 60079, 60032, 60150, 60111, 60110, 60114, 60055, 60158, 60187, 60184, 60188, 60189, 60212, 60213, 60216, 60129, 60218, 60147, 60027, 60109, 60142, 60164, 60008, 60161, 60162, 60105, 60026, 60195, 60194, 60196, 60177, 60170, 60099, 60019', wiki: '', description: 'Bipolar Cell Type: bc1 (NK3R+ & Syt2-)', viewLink: '//set/0/2/41'},
		{id: '42', name: '6n (mini-tONalpha)', neurons: '26035, 26043, 17082, 20198, 20073', wiki: '', description: 'Ganglion Cell Type: 6n (mini-tONalpha)', viewLink: '//set/0/1/42'},
		{id: '43', name: 'bc2 (NK3R+ & Syt2+, recoverin, Neto1,Cdh8)', neurons: '60135, 60133, 60140, 60130, 60209, 60208, 60004, 60223, 60221, 60138, 60037, 60157, 60124, 60112, 60010, 60011, 60038, 60039, 60167, 60214, 60159, 60217, 60182, 60012, 60226, 60013, 60219, 60120, 60046, 60210, 60044, 60043, 60042, 60041, 60040, 60080, 60025, 60002, 60001, 60021, 60006, 60023, 60022, 60102, 60103, 60009, 60101, 60029, 60104, 60149, 60003, 60141, 60224, 60097, 60169', wiki: '', description: 'Bipolar Cell Type: bc2 (NK3R+ & Syt2+, recoverin, Neto1, Cdh8)', viewLink: '//set/0/2/43'},
		{id: '44', name: 'bc3b (PKARIIbeta)', neurons: '60201, 60053, 60131, 60057, 60122, 60173, 60154, 60156, 60151, 60153, 60073, 60179, 60178, 60077, 60074, 60228, 60045, 60211, 60215, 60082, 60087, 60084, 60069, 60024, 60165, 60063, 60106, 60107, 60148, 60094, 60190, 60096, 60090, 60098', wiki: '', description: 'Bipolar Cell Type: bc3b (PKARIIbeta)', viewLink: '//set/0/2/44'},
		{id: '45', name: '63', neurons: '20140, 17114, 30002, 30003, 20178, 20071, 20181, 20208, 20129, 20011, 20005, 17097, 20019, 17140, 26057, 17084', wiki: '', description: 'Ganglion Cell Type: 63', viewLink: '//set/0/1/45'},
		{id: '46', name: '91n', neurons: '20042, 20218, 25003', wiki: '', description: 'Ganglion Cell Type: 91n', viewLink: '//set/0/1/46'},
		{id: '47', name: 'bc5o (5-HT3R-EGFP, Kcng4, Cdh9)', neurons: '60540, 60484, 60406, 60405, 60018, 60364, 60473, 60440, 60447, 60420, 60608, 60559, 60556, 60490, 60495, 60466, 60390, 60061, 60532, 60064, 60513, 60534, 60612, 60459, 60432, 60071, 60434, 60453', wiki: '', description: 'Bipolar Cell Type: bc5o (5-HT3R-EGFP,Kcng4,Cdh9)', viewLink: '//set/0/2/47'},
		{id: '48', name: '4ow (tOFFalpha)', neurons: '17188, 26004, 17079, 20156', wiki: '', description: 'Ganglion Cell Type: 4ow (tOFFalpha)', viewLink: '//set/0/1/48'},
		{id: '49', name: 'bc5t (?)', neurons: '60543, 60527, 60054, 60481, 60155, 60403, 60387, 60366, 60507, 60502, 60503, 60408, 60465, 60445, 60448, 60469, 60399, 60411, 60395, 60538, 60533, 60371, 60535, 60436, 60452', wiki: '', description: 'Bipolar Cell Type: bc5t (?)', viewLink: '//set/0/2/49'},
		{id: '50', name: '2i', neurons: '50004, 20234, 20051, 20082, 17092, 17013', wiki: '', description: 'Ganglion Cell Type: 2i', viewLink: '//set/0/1/50'},
		{id: '51', name: '72n', neurons: '20043, 20187, 26059, 20100, 20150', wiki: '', description: 'Ganglion Cell Type: 72n', viewLink: '//set/0/1/51'},
		{id: '52', name: 'bc4 (Csen)', neurons: '60202, 60206, 60058, 60222, 60220, 60119, 60171, 60175, 60174, 60117, 60116, 60183, 60186, 60185, 60047, 60121, 60089, 60125, 60127, 60083, 60086, 60144, 60168, 60143, 60100, 60160, 60067, 60163, 60191, 60095, 60091, 60197, 60199', wiki: '', description: 'Bipolar Cell Type: bc4 (Csen)', viewLink: '//set/0/2/52'},
		{id: '53', name: '51 (LED, w3)', neurons: '20153, 20212, 20182, 20258, 20097, 17095, 20120, 17098, 20037, 17035', wiki: '', description: 'Ganglion Cell Type: 51 (LED, w3)', viewLink: '//set/0/1/53'},
		{id: '54', name: '4i', neurons: '25004, 17022, 20174, 20170, 17057, 26006, 17247, 26050, 26008', wiki: '', description: 'Ganglion Cell Type: 4i', viewLink: '//set/0/1/54'},
		{id: '55', name: '5tow', neurons: '20240, 20128, 20165', wiki: '', description: 'Ganglion Cell Type: 5tow', viewLink: '//set/0/1/55'},
		{id: '56', name: '91w', neurons: '20020, 20081', wiki: '', description: 'Ganglion Cell Type: 91w', viewLink: '//set/0/1/56'},
		{id: '57', name: '2o', neurons: '10013, 10005, 17216, 26062', wiki: '', description: 'Ganglion Cell Type: 2o', viewLink: '//set/0/1/57'},
		{id: '58', name: 'rbc', neurons: '60568, 60569, 60031, 60520, 60521, 60544, 60560, 60369, 60564, 60565, 60566, 60567, 60382, 60384, 60427, 60400, 60506, 60365, 60600, 60586, 60587, 60584, 60585, 60582, 60583, 60463, 60581, 60610, 60609, 60468, 60588, 60589, 60601, 60392, 60576, 60613, 60603, 60606, 60590, 60551, 60605, 60563, 60555, 60557, 60604, 60577, 60558, 60575, 60574, 60573, 60572, 60571, 60570, 60359, 60596, 60518, 60515, 60591, 60357, 60536, 60372, 60595, 60594, 60474, 60475, 60472, 60580, 60593, 60471, 60017, 60456, 60592, 60599, 60598, 60479, 60597, 60602, 60607, 60378', wiki: '', description: 'Bipolar Cell Type: rbc', viewLink: '//set/0/2/58'},
		{id: '59', name: '37 (pON-OFF DS)', neurons: '20179, 20210, 20245, 20254, 20002, 20239', wiki: '', description: 'Ganglion Cell Type: 37 (pON-OFF DS)', viewLink: '//set/0/1/59'},
		{id: '60', name: '6w (tONalpha)', neurons: '20222, 17083, 26020, 20068, 20217', wiki: '', description: 'Ganglion Cell Type: 6w (tONalpha)', viewLink: '//set/0/1/60'},
		{id: '61', name: '2an (mini-J)', neurons: '17027, 50001, 20101, 20066, 20060, 20168, 20024, 17062, 17177, 15066, 15018, 17130, 20147, 10010, 10017, 20264, 17105', wiki: '', description: 'Ganglion Cell Type: 2an (mini-J)', viewLink: '//set/0/1/61'}
	];
	$scope.cards = allCards;
	$scope.txt   = '';
	$scope.data = {
		cb1: true,
		cb2: true,
	};
	
	var gcIDs = ',29,30,13,14,17,61,9,57,50,32,18,23,48,54,53,16,55,25,28,42,60,33,24,37,22,27,5,10,6,59,8,45,11,51,19,31,26,4,35,40,20,12,15,46,56,3,';
	var bcIDs = ',41,43,7,44,52,49,47,36,38,21,39,34,58,';
	
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

	var showGCs = true;
	var showBCs = true;

	$scope.bc = function (yes) {
		showBCs = !yes;
		
		if (yes) {
			if (showGCs) {
				$scope.cards = curGCs;
			}
			else {
				$scope.cards = [];
			}
		}
		else {
			if (showGCs) {
				$scope.cards = curBCs.concat(curGCs);
			}
			else {
				$scope.cards = curBCs;
			}
		}
		
	};

	$scope.gc = function (yes) {
		showGCs = !yes;
		
		if (yes) {
			if (showBCs) {
				$scope.cards = curBCs;
			}
			else {
				$scope.cards = [];
			}
		}
		else {
			if (showBCs) {
				$scope.cards = curBCs.concat(curGCs);
			}
			else {
				$scope.cards = curGCs;
			}
		}
	};

	$scope.querySize = 0;
	$scope.isDisabled = false;
	// list of `state` value/display objects
	this.states = loadAll();
	$scope.querySearch = querySearch;
	$scope.selectedItemChange = selectedItemChange;
	$scope.searchTextChange = searchTextChange;
});








