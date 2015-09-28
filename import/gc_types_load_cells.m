function gc=gc_types_load_cells_all()

gc=[

% 1 melanopsin: very large sparse
struct('name','1w','cells',[20203 20029]);
% 2 melanopsin m2? 
struct('name','1n','cells',[20157 20164 17110 17182 17050 17021 10007 20132 20092 17236 26019 26024]);
% 3 large sparse
struct('name','13','cells',[10018 17109]);
% cutoff: 17051

% 4 midi-J
struct('name','2aw','cells',[17075 17060 17028 20103 20201 17205 17107 20047 17144 17061 17200 26018]);
% cutoff: 17238
% 5 mini-j. outlier 17130. cutoff 10015
struct('name','2an','cells',[17177 20066 20060 17027 15018 17105 15066 10017 10010 17062 50001 20264 20168 20147 17130 20101 20024]);
% 6
struct('name','2','cells',[17216 10005 10013 50004 20082 17013 17092 20051 20234 26062]);
% 7 minor layer at L5
struct('name','25','cells',[20105 20104 20186 20237 20067 25006 17176 17132 20045 20036 26031]);

% 8
struct('name','3o','cells',[17135 20121 17024 17076 17037 17192 26003 26038]);
% 9
struct('name','3i','cells',[20107 17077 26063]);

% 10 CB2
struct('name','4on','cells',[20230 17064 17034 17167 17151 20041 26021]);
% 11 W7a
struct('name','4ow','cells',[17188 17079 20156 26004]);
% 12
struct('name','4i','cells',[25004 17022 20170 17247 20174 17057 26006 26008 26050]);

% 13
struct('name','5tow','cells',[20128 20165 20240]);
% 14 w3 
struct('name','5ton','cells',[17090 17181 17138 17011 50002 20114 20102 20216 20191 20184 20226 20262 17093 17121 17159 20089 17190 17078 17059 20127 20055]);
% 15
struct('name','5ti','cells',[17040 20135 20183 17071 20070 17055 26044]);
% 16
struct('name','5s','cells',[17160 17146 20223 17081 17127 17168 20053 20012]);


% 17 w3 similar regular
struct('name','51','cells',[20097 20120 20212 20182 17098 17095 20153 20258 17035 20037]);

% 18 bump
struct('name','68','cells',[20255 20113 20232 20046]);
% 19
struct('name','6w','cells',[20222 20217 17083 20068 26020]);
% 20
struct('name','6n','cells',[20198 20073 17082 26035 26043]);

% 21 very wide: m4? 
struct('name','8wi','cells',[20228]);
% 22 on alpha sustained
struct('name','8wo','cells',[17111 26001]);
% 23 wide
struct('name','8n','cells',[20126]);
% 24 
struct('name','9','cells',[20112 20076 20056 20006]);

% wide field 
% 25 ooDSGC. outliers: 20239 (with interlayer stuff) / 20210 (too few on stuff)
struct('name','37','cells',[90002 90001 25005 20254 20245 20239 20233 20220 20213 20210 20179 20137 20125 20096 17161 17080 20016 20014 20002]);

% 26 onDSGC. 
struct('name','7o','cells',[17053 20180 20075 26034]);
% 27 onDSGC. 
struct('name','7i','cells',[17152 20021 26002 26070]);
% 28 irregular bilayer
struct('name','63','cells',[20181 17140 20208 20178 17097 17114 17084 20140 20129 30003 20071 30002 20019 20011 20005 26057]);

% 29 regular bilayer, layers further
struct('name','72w','cells',[20166 20221 17069 20074]);
% 30 irregular bilayer, layers closer
struct('name','72n','cells',[20100 20187 20150 20043 26059]);
% 31 more at off layer
struct('name','27','cells',[20117 17212 26051 26065]);

% 32 trimodal
struct('name','85','cells',[20063 20072 20200 17012 17038 26061]);
% 33 regular bilayer even wider
struct('name','81','cells',[20158]);
% 34 irregular bilayer 
struct('name','83','cells',[17009 20197]);
% 35 regular bilayer 
struct('name','82w','cells',[20118]);
% 36 regular bilayer regular on-dsgc style
struct('name','82i','cells',[20251 30001 20161 26058 26067]);
% 37 irregular bilayer on-dsgc style
struct('name','82o','cells',[20069 20080 26052]);
% 38 irregular bilayer more at off layer
struct('name','28','cells',[20243 20155 20163 20257 26005 20167 26033]);

% 39 regular bilayer
struct('name','91n','cells',[20218 25003 20042]);
% 40 regular bilayer irregular on-dsgc style
struct('name','91w','cells',[20081 20020]);

];

