function gc=ganglion_cell_info()

gc=[

% melanopsin: very large sparse
struct('name','1ws','annotation','M1','cells',[20203 20029]);
% 
struct('name','1wt','annotation','sOFFalpha','cells',[10018 17109 26022]); 
% melanopsin? 
struct('name','1no','annotation','','cells',[20157 17110 17050 17021 20092 17236 26024 10007]);
% 
struct('name','1ni','annotation','','cells',[20164 17182 20132 26019 26087]);
%
% mini-j. outlier: 17130
struct('name','2an','annotation','mini-J','cells',[17177 20066 20060 17027 15018 17105 15066 10017 10010 17062 50001 20264 20168 20147 17130 20101 20024 26190 26026 26049 26082 26129 26147 26172 26041]);
% 
% midi-J: 17144(>>3o?) 17061 0201 26095 17200 26055 26189(>>3x?)
struct('name','2aw','annotation','midi-J','cells',[17075 17060 17028 20103 20201 17205 17107 20047 17144 17061 17200 26018 26150 26163 26189 26193 26095 26055 17024]); 
%
struct('name','2o','annotation','','cells',[17216 10005 10013 26062 26118]);
% suspicious: 17192 (26126<>26131)
struct('name','2i','annotation','','cells',[50004 17013 17092 20051 20234 20082 26109 17192 26157 26126]);
% 
struct('name','3o','annotation','','cells',[26155 20121 17037 17076]);
% mini tOffAlpha
struct('name','3i','annotation','mini-sOFFalpha','cells',[17135 20107 17077 26063 26104 26116 26188]);
%
struct('name','3x','annotation','','cells',[26003 26038 26110 26131]);
% 


% 
struct('name','4on','annotation','mini-tOFFalpha','cells',[20230 17064 17034 17167 17151 20041 26021 26086 26121 26146 26160]);
% 
struct('name','4ow','annotation','tOFFalpha','cells',[17188 17079 20156 26004]);
% 
struct('name','4i','annotation','','cells',[25004 17022 20170 17247 20174 17057 26006 26008 26050 26096 26102 26164]);
%

% 
struct('name','5to','annotation','','cells',[20128 20165 20240]);
% w3 like
struct('name','5ti','annotation','w3-like','cells',[17090 17181 50002 20114 20102 20216 20191 20184 20226 20262 20097 17093 17121 17159 20089 17190 17078 17059 20127 20055 26144 26170 26161 26156 26152 26123 26120 26112 26083 26053]);
% 
struct('name','5so','annotation','','cells',[17160 17146 20223 17081 17127 17168 20053 20012 26046 17138 17011 26111 26140 26151 26181 26187]);
% 17011 17138
struct('name','5si','annotation','','cells',[17040 20135 20183 17071 20070 17055 26044 26106 26159 26142 26133]);
% 

% 
struct('name','6sn','annotation','mini-tONalpha','cells',[20198 20073 17082 26035 26043 26171]);
% 
struct('name','6sw','annotation','tONalpha','cells',[20222 20217 17083 20068 26020]);
% 
struct('name','6t','annotation','','cells',[20255 20113 20232]);
% 

% onDSGC
struct('name','7o','annotation','tON DS','cells',[17053 20180 26034 26048 26100 26130 20239]);
% onDSGC
% struct('name','7i','annotation','sON DS','cells',[17152 26077 20021 26002 26128 20075 26070 26075 26078]);
struct('name','7id','annotation','sON DS dorsal','cells',[17152 26077]);
struct('name','7ic','annotation','sON DS caudal','cells',[20021 26002 26128 20075]);
struct('name','7iv','annotation','sON DS ventral','cells',[26070 26075 26078]);

% on alpha sustained
struct('name','8w','annotation','sONalpha, M4','cells',[17111 26001 26071 26079]);
% 
% struct('name','8n','annotation','','cells',[20126]);
% very wide 
% struct('name','9w','annotation','M2','cells',[20228]);
% 
struct('name','9m','annotation','','cells',[20112 20076 20056]);
%
struct('name','9n','annotation','','cells',[26149 26168 26127 20006]);

% w3: 
struct('name','51','annotation','w3','cells',[20120 20212 20182 17098 17095 20153 20258 17035 20037 26177 26154 26136 26113 26098 26085 26054 26039 26025 26122]);
% minor stratum at layer 5
struct('name','25','annotation','','cells',[20105 20104 20186 20237 20067 25006 17176 17132 20045 20036 26031 26134 26167 26042 26040 26037 26060 26066 26099 26117 26145 26175]);
% 

% trimodal
struct('name','58','annotation','','cells',[20063 20072 20200 17012 17038 26061 26045 26092 20046 26119]);


% ooDSGC. outliers: 20210 (very few on stuff)
% 26130 (20239??) purple cell by kevin. turns out to be 7o
% struct('name','37','annotation','ON-OFF DS','cells',[26047 20002 20179 20210 20254 26101 20245 26036 ...
%                                                      20014 20125 26029 26162 90002 26094 26032 26056 ...
%                                                      20016 20096 20233 26158 17161 20137 26115 26138 26137 ...
%                                                      90001 20213 25005 26103 17080 20220 26084 26165 26178]);

% purple 
struct('name','37r','annotation','ON-OFF DS','cells',[26047 20002 20179 20210 20254 26101 20245 26137 26036 26056]);
% green (+Z omni) ventral
struct('name','37v','annotation','ON-OFF DS','cells',[20014 20125 26029 26162 90002 26094]);
% yellow dorsal
struct('name','37d','annotation','ON-OFF DS','cells',[20016 20096 20233 26158 17161 20137 26115 26138 26178]);
% red 
struct('name','37c','annotation','ON-OFF DS','cells',[90001 20213 25005 26103 17080 20220 26084 26165 26032]);  

% OS. bistratified tall ~ tri-stratified
struct('name','63','annotation','','cells',[20181 17140 20208 20178 17097 17114 17084 20140 20129 30003 20071 30002 20019 20011 20005 26057 26191 26148 26141 26125 26089 26068 26028 26027 26023]);

% irregular bilayer
struct('name','72n','annotation','','cells',[20100 20187 20150 20043 26059 26073 26132]);
% regular bilayer, layers further
struct('name','72w','annotation','','cells',[20166 20221 17069 20074 26124]);
% regular bilayer. more at off layer
struct('name','27','annotation','','cells',[20117 17212 26051 26065]);

% regular bilayer two layer even further
struct('name','81i','annotation','','cells',[20158 26097 26090]);
%
struct('name','81o','annotation','','cells',[20069 26052]);
% regular bilayer 
struct('name','82wo','annotation','','cells',[20118 26091]);
%
struct('name','82wi','annotation','','cells',[20251 30001 26067]);
% [  26058 ]
struct('name','82n','annotation','','cells',[26076 26080 20161 26058 26072 20080]);
% 
% irregular bilayer 
struct('name','83','annotation','','cells',[17009 20197]);

% diffuse bilayer more at off layer
struct('name','28','annotation','','cells',[20243 20155 20163 20257 26005 20167 26033]);
% regular bilayer
struct('name','91n','annotation','','cells',[20218 25003 20042 26088 26074]);
% regular bilayer on-dsgc style
struct('name','91w','annotation','','cells',[20081 20020 26135]);

struct('name','orphans','annotation','','cells',[20126 20228]);

struct('name','weirdos','annotation','','cells',[17134 20248 26069 26093]);

struct('name','cutoffs','annotation','','cells',[10015 17051 17238 26081 26153 26030 26105 26114 26176 26107 26108]);
% 10015: 2an
% 17051: 2aw
% 17238: 2aw
% 26081: 85
% 26153: 63
% 26030: 28
% 26105: 6sw
% 26110: 1~3
% 26114: 82i
% 26176: 63
% 26107: 51
% 26108: 2an
];

