function [strat,gc]=gc_types_load_cells()

strat=[];
gc=[];

load /data/home/greenem/data/stratification/jinseop_helper/cell_info.mat
cell_info.init();

% ooDSGC regular bilayer
% outliers: 20239 (with interlayer stuff) / 20210 (to few on stuff)
gc(1).name='ooDSGC (BSGC1re)';
gc(1).cells=[90002 90001 25005 20254 20245 20239 20233 20220 20213 20210 20179 20137 20125 20096 17161 17080];
% onDSGC regular bilayer more at on layer (regular/irregular)
gc(2).name='OnDSGC (BSGC1rn)';
gc(2).cells=[17053 20180 17152 20075];
% irregular bilayer
gc(3).name='BSGC1ie';
gc(3).cells=[20181 17140 20208 20178 17097 17114 17084 20140 20129 30003 20071 30002];

% biGC2a: regular bilayer
gc(4).name='BSGC2re';
gc(4).cells=[20166 20221 17069 20074];
% biGC2b: more at off layer
gc(5).name='BSGC2rf';
gc(5).cells=[20117 17212];
% biGC2c: irregular bilayer
gc(6).name='BSGC2ie';
gc(6).cells=[20100 20187 20150];
% 20043

% biGC3a: regular bilayer 
gc(7).name='BSGC3re';
gc(7).cells=[20118 20167 20158];
% biGC3b: regular bilayer on-dsgc style
gc(8).name='BSGC3rn';
gc(8).cells=[20251 30001 20081 20161];
% bcGC3c: irregular bilayer on-dsgc style
gc(9).name='BSGC3in';
gc(9).cells=[20069 20080];
% bcGC3d: irregular bilayer more at off layer
gc(10).name='BSGC3if';
gc(10).cells=[20243 20155 20163 20257];
% bcGC3e: trimodal
gc(11).name='BSGC3t';
gc(11).cells=[20063 20072 20200 17012 17038 ];

% biGC4a: regular bilayer 
gc(12).name='BSGC4re';
gc(12).cells=[20218 25003];
% 20042
% biGC4c: irregular bilayer 
gc(13).name='BSGC4ie';
gc(13).cells=[17009 20197];

% biGC5: minor layer at sl3
gc(14).name='BSGC5m3';
gc(14).cells=[20105 20104 20186 20237 20067 25006 17176 17132]; 
% 20045 20036

% biGC6a: w3 irregular 
gc(15).name='W3 (BSGC6i)';
gc(15).cells=[17090 17181 17138 17011 50002 20114 20102 20216 20191 20184 20226 20262 17093 17121 17159 20089 17190 17078 17059 20127];
% + 20055
% biGC6b: w3 similar regular
gc(16).name='BSGC6r';
gc(16).cells=[20097 20120 20212 20182 17098 17095 20153 20258 17035];
% 20037

% sl-1a: mini-J. cutoff excluded: 17177 outlier: 17130 (most outer)
gc(17).name='mini-j';
gc(17).cells=[20066 20060 17027 15018 17105 15066 10017 10010 17062 50001 20264 20168 20147 17130 20101];
% sl-1b: midi-J
gc(18).name='midi-J';
gc(18).cells=[17075 17060 17028 20103 20201 17205 17107];
% 20047
% sl-1i: multiple types?
gc(19).name='s1i';
gc(19).cells=[17037 17144 17024 17076 20121 17092 20082 17192 50004 17013 17135 20234];
% 20051 
% sl-1t: plateau
gc(20).name='s1m';
gc(20).cells=[17216 10005 10013];
% sl-1n: melanopsin
gc(21).name='s1o (melanopsin)';
gc(21).cells=[20157 20164 17110 17236 17182 17050 17021 10007 20132 20092];
% sl-1nXL:
gc(22).name='s1oL';
gc(22).cells=[20203];

% sl-2tL
gc(23).name='s2a';
gc(23).cells=[20107 17077];
% sl-2ns
gc(24).name='s2ns';
gc(24).cells=[20230 17064 17034 17167 17151];
% sl-2nL
gc(25).name='s2nL';
gc(25).cells=[17188 17079 20156];

% sl-2.5
gc(26).name='s3a';
gc(26).cells=[25004 17022 20170 17057];
% sl-3t 
gc(27).name='s3b';
gc(27).cells=[20128 17247 20165 20174 20240 17057];
% sl-3ti
gc(28).name='s3c';
gc(28).cells=[17040 20135 20183 17071];
% sl-3n
gc(29).name='s3n';
gc(29).cells=[17160 17146 20223 17081 17127 17168];
% + 20053 20041

% sl-4t
gc(30).name='s4t';
gc(30).cells=[20255 20113 20232 20070 17055];
% 20046
% sl-4nm
gc(31).name='s4ns';
gc(31).cells=[20222 20217 17083 20068];
% sl-4ns
gc(32).name='s4nL';
gc(32).cells=[20198 20073 17082];
% 
% sl-5
gc(33).name='s5s';
gc(33).cells=[20228 17111];
gc(34).name='s5L';
gc(34).cells=[20126 20112 20076 20056];


for i=1:numel(gc)
    for cellid=gc(i).cells;
        s=cell_info.stratification(cellid);
        [m,idx]=max(s(92:100));
        s(92+idx-1:100)=m;
        [m,idx]=min(s(80:100));
        s(80+idx:100)=m/2;
        strat{cellid}=s/sum(s);
    end
end


