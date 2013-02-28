-- User Access Tracking for the ACE Omniscience Module.
-- File : 'omni.sql'
-- Database structure for the Omniscience activity tracking system.
-- Copyright (c)2012 The New Waters Foundation Inc, all rights reserved.  For license see: http://OpenAce.org/license?id=omni.sql

-- --------------------------------------------------------



-- ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
-- Core System Functionality
-- ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++



--	Site_pri
--
--	The sites registered to the Omni tracking service.

CREATE TABLE "Site_pri" (
	"SiteID" SERIAL PRIMARY KEY,
	"Name" varchar(50) NOT NULL DEFAULT '',
	"Description" text NOT NULL DEFAULT '',
	"Domain" text NOT NULL DEFAULT '',
	"Registered" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"Value" float NOT NULL DEFAULT '0'
);

-- CREATE INDEX "Domain_index" ON "Site_pri" ("SiteID" DESC NULLS LAST);

INSERT INTO "Site_pri" ("Name", "Description", "Domain", "Value") VALUES 
('Test Site', 'Not a real website, used for testing purposes.', 'example.com', '-1');

-- --------------------------------------------------------


--	Key_pri
--
--	All keys currently used in this system, in whatever form they are passed.

CREATE TABLE "Key_pri" (
	"PriKeyID" SERIAL PRIMARY KEY,
	"OldKeyID" integer NOT NULL DEFAULT '1' REFERENCES "Key_pri",
	"PriKey" varchar(64) NOT NULL DEFAULT '',
	"OldKey" varchar(64) NOT NULL DEFAULT '',
	"PubKey" varchar(64) NOT NULL DEFAULT '',
	"Hash" varchar(64) NOT NULL DEFAULT '',
	"IP" varchar(50) NOT NULL DEFAULT '',
	"IpID" integer NOT NULL DEFAULT '1',
	"RemoteIP" varchar(50) NOT NULL DEFAULT '',
	"ProxyStr" text NOT NULL DEFAULT '',
	"SiteID" integer NOT NULL DEFAULT '1',
	"PageID" integer NOT NULL DEFAULT '1',
	"Url" text NOT NULL DEFAULT '',
	"BrowserString" text NOT NULL DEFAULT '',
	"BrowserID" integer NOT NULL DEFAULT '1',
	"HitID" integer NOT NULL DEFAULT '1',
	"ConnectionID" integer NOT NULL DEFAULT '1',
	"DeviceID" integer NOT NULL DEFAULT '1',
	"PrintID" integer NOT NULL DEFAULT '1',
	"UserID" integer NOT NULL DEFAULT '1',
	"Cookies" text NOT NULL DEFAULT '',
	"CookiesEnabled" varchar(3) NOT NULL DEFAULT '',
	"CreateTime" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"Duration" timestamp NOT NULL DEFAULT 'epoch',
	"Active" boolean NOT NULL DEFAULT '1',
	"Value" float NOT NULL DEFAULT '0'
);

CREATE INDEX "PubKey-index" ON "Key_pri" ("PubKey" DESC NULLS LAST);

INSERT INTO "Key_pri" ("PriKey", "Value") VALUES 
('Test Key, not real.', '-1');

-- --------------------------------------------------------


--	Hit_pri
--
--	All hits made to sites in this system.

CREATE TABLE "Hit_pri" (
	"HitID" SERIAL PRIMARY KEY,
	"PriKeyID" integer NOT NULL DEFAULT '1',
	"SiteID" integer NOT NULL DEFAULT '1',
	"IpID" integer NOT NULL DEFAULT '1',
	"IP" varchar(50) NOT NULL DEFAULT '',
	"Url" text NOT NULL DEFAULT '',
	"PageID" integer NOT NULL DEFAULT '1',
	"BrowserID" integer NOT NULL DEFAULT '1',
	"BrowserString" text NOT NULL DEFAULT '',
	"DeviceID" integer NOT NULL DEFAULT '1',
	"DeviceString" text NOT NULL DEFAULT '',
	"ConnectionID" integer NOT NULL DEFAULT '1',
	"PrintID" integer NOT NULL DEFAULT '1',
	"UserID" integer NOT NULL DEFAULT '1',
	"Sender" text NOT NULL DEFAULT '',
	"Cookies" text NOT NULL DEFAULT '',
	"CookiesEnabled" varchar(3) NOT NULL DEFAULT '',
	"Data" text NOT NULL DEFAULT '',
	"Times" text NOT NULL DEFAULT '',
	"InitLog" text NOT NULL DEFAULT '',
	"PingLog" text NOT NULL DEFAULT '',
	"ClientLog" text NOT NULL DEFAULT '',
	"ClientTimes" text NOT NULL DEFAULT '',
	"ClientWindow" text NOT NULL DEFAULT '',
	"Value" float NOT NULL DEFAULT '0',
	"OmniStart" timestamp NOT NULL DEFAULT 'epoch',
	"TimeStamp" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO "Hit_pri" ("Value") VALUES ('-1');

-- --------------------------------------------------------


--	Connection_pri
--
--	All open connections in this system.  Used as the central point of access for variables and screen behavior. Enables multiple simultaneous users or views from same window.

CREATE TABLE "Connection_pri" (
	"ConnectionID" SERIAL PRIMARY KEY,
	"PrintID" integer NOT NULL DEFAULT '1',
	"UserID" integer NOT NULL DEFAULT '1',
	"IpID" integer NOT NULL DEFAULT '1',
	"SiteID" integer NOT NULL DEFAULT '1',
	"Sender" text NOT NULL DEFAULT '',
	"BrowserID" integer NOT NULL DEFAULT '1',
	"DeviceID" integer NOT NULL DEFAULT '1',
	"Active" boolean NOT NULL DEFAULT '0',
	"Value" float NOT NULL DEFAULT '0',
	"StartConnectionTime" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"LastActionTime" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"Duration" timestamp NOT NULL DEFAULT 'epoch'
);

INSERT INTO "Connection_pri" ("Value") VALUES ('-1');

-- --------------------------------------------------------


--	Activity_log
--
--	All activity streamed to this system.

CREATE TABLE "Activity_log" (
	"LogID" SERIAL PRIMARY KEY,
	"PriKeyID" integer NOT NULL DEFAULT '1',
	"HitID" integer NOT NULL DEFAULT '1',
	"ConnectionID" integer NOT NULL DEFAULT '1',
	"CallID" integer NOT NULL DEFAULT '1',
	"IP" varchar(50) NOT NULL DEFAULT '',
	"IpID" integer NOT NULL DEFAULT '1',
	"RemoteIP" varchar(50) NOT NULL DEFAULT '',
	"FwdIpStr" text NOT NULL DEFAULT '',
	"BrowserID" integer NOT NULL DEFAULT '1',
	"BrowserString" text NOT NULL DEFAULT '',
	"DeviceID" integer NOT NULL DEFAULT '1',
	"DeviceString" text NOT NULL DEFAULT '',
	"SiteID" integer NOT NULL DEFAULT '1',
	"PrintID" integer NOT NULL DEFAULT '1',
	"UserID" integer NOT NULL DEFAULT '1',
	"Data" text NOT NULL DEFAULT '',
	"Log" text NOT NULL DEFAULT '',
	"Times" text NOT NULL DEFAULT '',
	"Value" float NOT NULL DEFAULT '0',
	"TimeSent" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO "Activity_log" ("Value") VALUES ('-1');

-- --------------------------------------------------------


--	Pattern_typ
--
--	The patterns that translate into custom events. 

CREATE TABLE "Pattern_typ" (
	"PatternTyp" SERIAL PRIMARY KEY,
	"Name" varchar(50) NOT NULL DEFAULT '',
	"Description" text NOT NULL DEFAULT '',
	"Code" varchar(10) NOT NULL DEFAULT '' UNIQUE,
	"Json" text NOT NULL DEFAULT '',
	"Value" float NOT NULL DEFAULT '0'
);

INSERT INTO "Pattern_typ" ("Name", "Description", "Code", "Value") VALUES 
('Hover Wary', 'When a user hovers over an item for a period of time but does not click on it.', 'hov-wary', '0');

-- --------------------------------------------------------


--	Event_log
--
--	All events and actions triggered by users and registered in this system.

CREATE TABLE "Event_log" (
	"LogID" SERIAL PRIMARY KEY,
	"PatternTyp" integer NOT NULL DEFAULT '1' REFERENCES "Pattern_typ",
	"ConnectionID" integer NOT NULL DEFAULT '1',
	"HitID" integer NOT NULL DEFAULT '1',
	"PrintID" integer NOT NULL DEFAULT '1',
	"UserID" integer NOT NULL DEFAULT '1',
	"Time" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"Value" float NOT NULL DEFAULT '0'
);

INSERT INTO "Event_log" ("Value") VALUES ('-1');

-- --------------------------------------------------------


--	Call_pri
--
--	All calls made from sites in this system.

CREATE TABLE "Call_pri" (
	"CallID" SERIAL PRIMARY KEY,
	"SiteID" integer NOT NULL DEFAULT '1',
	"PriKeyID" integer NOT NULL DEFAULT '1',
	"TimeStamp" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"ConnectionID" integer NOT NULL DEFAULT '1',
	"PrintID" integer NOT NULL DEFAULT '1',
	"UserID" integer NOT NULL DEFAULT '1',
	"HitID" integer NOT NULL DEFAULT '1',
	"IP" varchar(50) NOT NULL DEFAULT '',
	"BrowserID" integer NOT NULL DEFAULT '1',
	"BrowserString" text NOT NULL DEFAULT '',
	"Url" text NOT NULL DEFAULT '',
	"Sender" text NOT NULL DEFAULT '',
	"cmd" text NOT NULL DEFAULT '',
	"Value" float NOT NULL DEFAULT '0'
);

INSERT INTO "Call_pri" ("Value") VALUES ('-1');

-- --------------------------------------------------------


--	IpData_pri
--
--	Listing of all IP addresses used to access this system and relevant GeoLocation data for them.

CREATE TABLE "IpData_pri" (
	"IpID" SERIAL PRIMARY KEY,
	"IP" varchar(50) NOT NULL DEFAULT '',
	"ServerName" varchar(150) NOT NULL DEFAULT '',
	"City" varchar(50) NOT NULL DEFAULT '',
	"Region" varchar(50) NOT NULL DEFAULT '',
	"AreaCode" varchar(50) NOT NULL DEFAULT '',
	"DmaCode" varchar(50) NOT NULL DEFAULT '',
	"CountryCode" varchar(50) NOT NULL DEFAULT '',
	"CountryName" varchar(50) NOT NULL DEFAULT '',
	"ContinentCode" varchar(50) NOT NULL DEFAULT '',
	"Latitude" varchar(50) NOT NULL DEFAULT '',
	"Longitude" varchar(50) NOT NULL DEFAULT '',
	"RegionCode" varchar(50) NOT NULL DEFAULT '',
	"RegionName" varchar(50) NOT NULL DEFAULT '',
	"CurrencyCode" varchar(50) NOT NULL DEFAULT '',
	"CurrencySymbol" varchar(50) NOT NULL DEFAULT '',
	"Registered" timestamp NOT NULL DEFAULT 'epoch',
	"FirstAccessTime" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"Value" float NOT NULL DEFAULT '0'
);

INSERT INTO "IpData_pri" ("IP", "ServerName", "Value") VALUES 
('76.181.64.210', 'The default admin IP.', '1');

-- --------------------------------------------------------


--	Browser_pri
--
--	The various browser headers that have been received to this server.

CREATE TABLE "Browser_pri" (
	"BrowserID" SERIAL PRIMARY KEY,
	"Name" varchar(50) NOT NULL DEFAULT '',
	"Description" text NOT NULL DEFAULT '',
	"Header" text NOT NULL DEFAULT '',
	"Registered" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"Value" float NOT NULL DEFAULT '0'
);

INSERT INTO "Browser_pri" ("Name", "Description", "Value") VALUES 
('Generic', 'The DEFAULT generic browser, html interface via any standards-compliant internet browser.', '-1');

-- --------------------------------------------------------


--	Device_pri
--
--	The various device profiles that have been received to this server.

CREATE TABLE "Device_pri" (
	"DeviceID" SERIAL PRIMARY KEY,
	"Name" varchar(50) NOT NULL DEFAULT '',
	"Description" text NOT NULL DEFAULT '',
	"Screen" text NOT NULL DEFAULT '',
	"Props" text NOT NULL DEFAULT '',
	"Vars" text NOT NULL DEFAULT '',
	"Registered" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"Value" float NOT NULL DEFAULT '0'
);

INSERT INTO "Device_pri" ("Name", "Description", "Value") VALUES 
('Test Device', 'Not a real device. Generic interface, used for testing purposes.', '-1');

-- --------------------------------------------------------


--	Page_pri
--
--	Pages and views that can be accessed through a web site.

CREATE TABLE "Page_pri" (
	"NavID" SERIAL PRIMARY KEY,
	"SiteID" integer NOT NULL DEFAULT '1' REFERENCES "Site_pri",
	"Name" varchar(50) NOT NULL DEFAULT '',
	"Description" text NOT NULL DEFAULT '',
	"Attributes" text NOT NULL DEFAULT '',
	"Code" varchar(50) NOT NULL DEFAULT '' UNIQUE,
	"Value" float NOT NULL DEFAULT '0'
);

INSERT INTO "Page_pri" ("Value") VALUES ('-1');

-- --------------------------------------------------------



-- ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
-- User Items
-- ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++



--	User_pri
--
--	All registered users logged by this system.

CREATE TABLE "User_pri" (
	"UserID" SERIAL PRIMARY KEY,
	"Name" varchar(50) NOT NULL DEFAULT '',
	"SiteKey" varchar(50) NOT NULL DEFAULT '',
	"Description" text NOT NULL DEFAULT '',
	"Value" float NOT NULL DEFAULT '0'
);

INSERT INTO "User_pri" ("Name", "SiteKey", "Description", "Value") VALUES 
('Generic User', 'fakeSiteKey', 'Not an actual user.', '-1');

-- --------------------------------------------------------


--	Print_pri
--
--	All temporary user profiles accessing this system. Will convert to actual user(s) when associated to account(s)

CREATE TABLE "Print_pri" (
	"PrintID" SERIAL PRIMARY KEY,
	"Name" varchar(50) NOT NULL DEFAULT '',
	"DeviceID" integer NOT NULL DEFAULT '1' REFERENCES "Device_pri",
	"BrowserID" integer NOT NULL DEFAULT '1' REFERENCES "Browser_pri",
	"Description" text NOT NULL DEFAULT '',
	"Value" float NOT NULL DEFAULT '0',
	"FirstAccessIP" varchar(50) NOT NULL DEFAULT '',
	"FirstAccessTime" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "DeviceID-index" ON "Print_pri" ("DeviceID" DESC NULLS LAST);
CREATE INDEX "BrowserID-index" ON "Print_pri" ("BrowserID" DESC NULLS LAST);

INSERT INTO "Print_pri" ("Name", "Description", "Value") VALUES 
('Test Print', 'Not an actual print profile.', '-1');

-- --------------------------------------------------------


--	Print_User_ref
--
--	Links print profiles to registered Users.

CREATE TABLE "Print_User_ref" (
	"RefID" SERIAL PRIMARY KEY,
	"PrintID" integer NOT NULL DEFAULT '1' REFERENCES "Print_pri",
	"UserID" integer NOT NULL DEFAULT '1' REFERENCES "User_pri",
	"Value" float NOT NULL DEFAULT '0'
);

INSERT INTO "Print_User_ref" ("Value") VALUES ('-1');

-- --------------------------------------------------------


--	Print_IP_ref
--
--	Links fingerprint profiles to registered IP addresses.

CREATE TABLE "Print_IP_ref" (
	"RefID" SERIAL PRIMARY KEY,
	"PrintID" integer NOT NULL DEFAULT '1' REFERENCES "Print_pri",
	"IpID" integer NOT NULL DEFAULT '1' REFERENCES "IpData_pri",
	"Value" float NOT NULL DEFAULT '0'
);

INSERT INTO "Print_IP_ref" ("Value") VALUES ('-1');

-- --------------------------------------------------------


--	User_Prefs_pri
--
--	Links Users to their system preferences

CREATE TABLE "User_prefs_pri" (
	"UserPrefsID" SERIAL PRIMARY KEY,
	"UserID" integer NOT NULL DEFAULT '1',
	"TransitionSpeed" float NOT NULL DEFAULT '.25',
	"Cookies" varchar(50) NOT NULL DEFAULT '1',
	"Value" float NOT NULL DEFAULT '0'
);

INSERT INTO "User_prefs_pri" ("Value") VALUES ('-1');

-- --------------------------------------------------------


--	Visit_log
--
--	All session visits made by users.

CREATE TABLE "User_Visit_log" (
	"LogID" SERIAL PRIMARY KEY,
	"PrintID" integer NOT NULL DEFAULT '1',
	"IpID" integer NOT NULL DEFAULT '1' REFERENCES "IpData_pri",
	"ConnectionID" integer NOT NULL DEFAULT '1',
	"UserID" integer NOT NULL DEFAULT '1',
	"SiteID" integer NOT NULL DEFAULT '1',
	"LoginTime" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"LogoutTime" timestamp NOT NULL DEFAULT 'epoch',
	"Value" float NOT NULL DEFAULT '0'
);

INSERT INTO "User_Visit_log" ("Value") VALUES ('-1');

-- --------------------------------------------------------


--	User_Nav_log
--
--	Logging navigation data for each step taken within the system.

CREATE TABLE "User_Nav_log" (
	"NavLogID" SERIAL PRIMARY KEY,
	"ConnectionID" integer NOT NULL DEFAULT '1',
	"PrintID" integer NOT NULL DEFAULT '1',
	"UserID" integer NOT NULL DEFAULT '1',
	"SiteID" integer NOT NULL DEFAULT '1',
	"url" text NOT NULL DEFAULT '',
	"NavID" integer NOT NULL DEFAULT '1',
	"Time" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"Value" float NOT NULL DEFAULT '0'
);

INSERT INTO "User_Nav_log" ("Value") VALUES ('-1');

-- --------------------------------------------------------


--	Flag_typ
--
--	Various items that can be flagged to abstract complex behavior into simple markers. 

CREATE TABLE "Flag_typ" (
	"FlagTyp" SERIAL PRIMARY KEY,
	"Name" varchar(50) NOT NULL DEFAULT '',
	"Description" text NOT NULL DEFAULT '',
	"Code" varchar(10) NOT NULL DEFAULT '' UNIQUE,
	"Value" float NOT NULL DEFAULT '0'
);

INSERT INTO "Flag_typ" ("Name", "Description", "Code", "Value") VALUES 
('Hover', 'When a user hovers over an item but does not click on it.', '1', '0');

-- --------------------------------------------------------


--	TimeBlock_pri
--
--	A block of time, and associated items.

CREATE TABLE "TimeBlock_pri" (
	"TimeBlockID" SERIAL PRIMARY KEY,
	"PrintID" integer NOT NULL DEFAULT '1',
	"Name" varchar(50) NOT NULL DEFAULT '',
	"Description" text NOT NULL DEFAULT '',
	"Note" text NOT NULL DEFAULT '',
	"Date" date NOT NULL DEFAULT CURRENT_DATE,
	"StartTime" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"EndTime" timestamp NOT NULL DEFAULT 'epoch',
	"Less" interval NOT NULL DEFAULT '00:00:00',
	"More" interval NOT NULL DEFAULT '00:00:00',
	"Time" interval NOT NULL DEFAULT '00:00:00',
	"Value" float NOT NULL DEFAULT '0'
);

INSERT INTO "TimeBlock_pri" ("Value") VALUES ('-1');

-- --------------------------------------------------------




