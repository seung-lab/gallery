function gc=gc_types_load_cells()

gc=[

% 1: very large sparse
struct('class','GC monostratified','name','gc m1sw','cells',[20203 20029]);
% 2: (melanopsin)
struct('class','GC monostratified','name','gc m1sn','cells',[20157 20164 17110 17182 17050 17021 10007 20132 20092 17236]);
% 3: large sparse
struct('class','GC monostratified','name','gc m1t','cells',[10018 17109 17051]);

% 4: midi-J
struct('class','GC monostratified','name','gc m2aw','cells',[17075 17060 17028 20103 20201 17205 17107 20047 17144 17061 17238 17200]);
% 5: mini-j. outlier 17130. cutoff 10015
struct('class','GC monostratified','name','gc m2an','cells',[17177 20066 20060 17027 15018 17105 15066 10017 10010 17062 50001 20264 20168 20147 17130 20101 20024]);
% 6: 
struct('class','GC monostratified','name','gc m2','cells',[17216 10005 10013 50004 20082 17013 17092 20051 20234]);

% 7:
struct('class','GC monostratified','name','gc m3o','cells',[17135 20121 17024 17076 17037 17192]);
% 8:
struct('class','GC monostratified','name','gc m3i','cells',[20107 17077]);

% 9:
struct('class','GC monostratified','name','gc m4sn','cells',[20230 17064 17034 17167 17151 20041]);
% 10:
struct('class','GC monostratified','name','gc m4sw','cells',[17188 17079 20156]);
% 11:
struct('class','GC monostratified','name','gc m4si','cells',[25004 17022 20170 17247 20174 17057]);
% 12:
struct('class','GC monostratified','name','gc m4t','cells',[20128 20165 20240]);

% 13:
struct('class','GC monostratified','name','gc m5s','cells',[17160 17146 20223 17081 17127 17168 20053 20012]);
% 14:
struct('class','GC monostratified','name','gc m5t','cells',[17040 20135 20183 17071 20070 17055]);

% 15: bump
struct('class','GC monostratified','name','gc m6t','cells',[20255 20113 20232 20046]);
% 16:
struct('class','GC monostratified','name','gc m6sw','cells',[20222 20217 17083 20068]);
% 17:
struct('class','GC monostratified','name','gc m6sn','cells',[20198 20073 17082]);

% 18: very wide
struct('class','GC monostratified','name','gc m7','cells',[20021]);

% 19: very wide
struct('class','GC monostratified','name','gc m8w','cells',[20228 17111]);
% 20: wide
struct('class','GC monostratified','name','gc m8n','cells',[20126]);

% 21:
struct('class','GC monostratified','name','gc m9','cells',[20112 20076 20056]);

% 22:
struct('class','GC monostratified','name','weirdos','cells',[17134 20248]);


% diffuse ~ bistratified cells

% narrow field 
% 23: w3 
struct('class','GC multistratified','name','gc bn1d','cells',[17090 17181 17138 17011 50002 20114 20102 20216 20191 20184 20226 20262 17093 17121 17159 20089 17190 17078 17059 20127 20055]);
% 24: w3 similar regular
struct('class','GC multistratified','name','gc bn1r','cells',[20097 20120 20212 20182 17098 17095 20153 20258 17035 20037]);

% 25: minor layer at sl3
struct('class','GC multistratified','name','gc bn2','cells',[20105 20104 20186 20237 20067 25006 17176 17132 20045 20036]);

 
% wide field 
% 26: ooDSGC. outliers: 20239 (with interlayer stuff) / 20210 (too few on stuff)
struct('class','GC multistratified','name','gc bw1re','cells',[90002 90001 25005 20254 20245 20239 20233 20220 20213 20210 20179 20137 20125 20096 17161 17080 20016 20014]);
% 27: onDSGC (regular/irregular)
struct('class','GC multistratified','name','gc bw1ro','cells',[17053 20180 17152 20075]);
% 28: irregular bilayer
struct('class','GC multistratified','name','gc bw1de','cells',[20181 17140 20208 20178 17097 17114 17084 20140 20129 30003 20071 30002 20019 20011]);

% 29: regular bilayer
struct('class','GC multistratified','name','gc bw2re','cells',[20166 20221 17069 20074]);
% 30: more at off layer
struct('class','GC multistratified','name','gc bw2rf','cells',[20117 17212]);
% 31: irregular bilayer
struct('class','GC multistratified','name','gc bw2d','cells',[20100 20187 20150 20043]);

% 32: regular bilayer 
struct('class','GC multistratified','name','gc bw3re','cells',[20118 20167 20158]);
% 33: regular bilayer on-dsgc style
struct('class','GC multistratified','name','gc bw3ro','cells',[20251 30001 20081 20161 20020]);
% 34: irregular bilayer on-dsgc style
struct('class','GC multistratified','name','gc bw3do','cells',[20069 20080]);
% 35: irregular bilayer more at off layer
struct('class','GC multistratified','name','gc bw3df','cells',[20243 20155 20163 20257]);
% 36: trimodal
struct('class','GC multistratified','name','gc tw3','cells',[20063 20072 20200 17012 17038]);

% 37: regular bilayer
struct('class','GC multistratified','name','gc bw4re','cells',[20218 25003 20042]);
% 38: irregular bilayer 
struct('class','GC multistratified','name','gc bw4de','cells',[17009 20197]);

];