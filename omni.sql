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

CREATE INDEX "Domain_index" ON "Site_pri" ("SiteID" DESC NULLS LAST);

INSERT INTO "Site_pri" ("SiteID", "Name", "Description", "Domain") VALUES 
('1', 'Test Site', 'Not a real website, used for testing purposes.', 'example.com');

-- --------------------------------------------------------


--	Key_pri
--
--	All keys currently used in this system, in whatever form they are passed.

CREATE TABLE "Key_pri" (
	"PriKeyID" SERIAL PRIMARY KEY,
	"OldKeyID" integer NOT NULL DEFAULT '0' REFERENCES "Key_pri",
	"PriKey" varchar(64) NOT NULL DEFAULT '',
	"OldKey" varchar(64) NOT NULL DEFAULT '',
	"PubKey" varchar(64) NOT NULL DEFAULT '',
	"Hash" varchar(64) NOT NULL DEFAULT '',
	"IP" varchar(50) NOT NULL DEFAULT '',
	"IpID" integer NOT NULL DEFAULT '0',
	"RemoteIP" varchar(50) NOT NULL DEFAULT '',
	"ProxyStr" text NOT NULL DEFAULT '',
	"SiteID" integer NOT NULL DEFAULT '0',
	"PageID" integer NOT NULL DEFAULT '0',
	"Url" text NOT NULL DEFAULT '',
	"BrowserString" text NOT NULL DEFAULT '',
	"BrowserID" integer NOT NULL DEFAULT '0',
	"HitID" integer NOT NULL DEFAULT '0',
	"ConnectionID" integer NOT NULL DEFAULT '0',
	"DeviceID" integer NOT NULL DEFAULT '0',
	"PrintID" integer NOT NULL DEFAULT '0',
	"UserID" integer NOT NULL DEFAULT '0',
	"Cookies" text NOT NULL DEFAULT '',
	"CookiesEnabled" varchar(3) NOT NULL DEFAULT '',
	"CreateTime" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"Duration" timestamp NOT NULL DEFAULT 'epoch',
	"Active" boolean NOT NULL DEFAULT '1',
	"Value" float NOT NULL DEFAULT '0'
);

CREATE INDEX "PubKey-index" ON "Key_pri" ("PubKey" DESC NULLS LAST);

INSERT INTO "Key_pri" ("PriKeyID", "PriKey", "OldKeyID") VALUES 
('1', 'New_Connection_--_No_Key', '1');

-- --------------------------------------------------------


--	Hit_pri
--
--	All hits made to sites in this system.

CREATE TABLE Hit_pri (
	"HitID" SERIAL PRIMARY KEY,
	"PriKeyID" integer NOT NULL DEFAULT '0',
	"SiteID" integer NOT NULL DEFAULT '0',
	"IpID" integer NOT NULL DEFAULT '0',
	"IP" varchar(50) NOT NULL DEFAULT '',
	"Url" text NOT NULL DEFAULT '',
	"PageID" integer NOT NULL DEFAULT '0',
	"BrowserID" integer NOT NULL DEFAULT '0',
	"BrowserString" text NOT NULL DEFAULT '',
	"DeviceID" integer NOT NULL DEFAULT '0',
	"DeviceString" text NOT NULL DEFAULT '',
	"ConnectionID" integer NOT NULL DEFAULT '0',
	"PrintID" integer NOT NULL DEFAULT '0',
	"UserID" integer NOT NULL DEFAULT '0',
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

-- --------------------------------------------------------


--	Connection_pri
--
--	All open connections in this system.  Used as the central point of access for variables and screen behavior. Enables multiple simultaneous users or views from same window.

CREATE TABLE Connection_pri (
	"ConnectionID" SERIAL PRIMARY KEY,
	"PrintID" integer NOT NULL DEFAULT '0',
	"UserID" integer NOT NULL DEFAULT '0',
	"IpID" integer NOT NULL DEFAULT '0',
	"SiteID" integer NOT NULL DEFAULT '0',
	"Sender" text NOT NULL DEFAULT '',
	"BrowserID" integer NOT NULL DEFAULT '0',
	"DeviceID" integer NOT NULL DEFAULT '0',
	"Active" boolean NOT NULL DEFAULT '0',
	"Value" float NOT NULL DEFAULT '0',
	"StartConnectionTime" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"LastActionTime" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"Duration" timestamp NOT NULL DEFAULT 'epoch'
);

-- INSERT INTO Connection_pri (ConnectionID, UserID, UserIP, BrowserID, Active, Value) VALUES 
-- ('1', '1', '76.181.64.210', '2', '1', '0');

-- --------------------------------------------------------


--	Activity_log
--
--	All activity streamed to this system.

CREATE TABLE Activity_log (
	"LogID" SERIAL PRIMARY KEY,
	"PriKeyID" integer NOT NULL DEFAULT '0',
	"HitID" integer NOT NULL DEFAULT '0',
	"ConnectionID" integer NOT NULL DEFAULT '0',
	"CallID" integer NOT NULL DEFAULT '0',
	"IP" varchar(50) NOT NULL DEFAULT '',
	"IpID" integer NOT NULL DEFAULT '0',
	"RemoteIP" varchar(50) NOT NULL DEFAULT '',
	"FwdIpStr" text NOT NULL DEFAULT '',
	"BrowserID" integer NOT NULL DEFAULT '0',
	"BrowserString" text NOT NULL DEFAULT '',
	"DeviceID" integer NOT NULL DEFAULT '0',
	"DeviceString" text NOT NULL DEFAULT '',
	"SiteID" integer NOT NULL DEFAULT '0',
	"PrintID" integer NOT NULL DEFAULT '0',
	"UserID" integer NOT NULL DEFAULT '0',
	"Data" text NOT NULL DEFAULT '',
	"Log" text NOT NULL DEFAULT '',
	"Times" text NOT NULL DEFAULT '',
	"Value" float NOT NULL DEFAULT '0',
	"TimeSent" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- --------------------------------------------------------


--	Pattern_typ
--
--	The patterns that translate into custom events. 

CREATE TABLE Pattern_typ (
	"PatternTyp" SERIAL PRIMARY KEY,
	"Name" varchar(50) NOT NULL DEFAULT '',
	"Description" text NOT NULL DEFAULT '',
	"Code" varchar(10) NOT NULL DEFAULT '',
	"Json" text NOT NULL DEFAULT '',
	"Value" float NOT NULL DEFAULT '0',
	UNIQUE ("Code")
);

INSERT INTO Pattern_typ ("PatternTyp", "Name", "Description", "Code", "Value") VALUES 
('1', 'Hover Wary', 'When a user hovers over an item for a period of time but does not click on it.', 'hov-wary', '0');

-- --------------------------------------------------------


--	Event_log
--
--	All events and actions triggered by users and registered in this system.

CREATE TABLE Event_log (
	"LogID" SERIAL PRIMARY KEY,
	"PatternTyp" integer NOT NULL DEFAULT '0' REFERENCES Pattern_typ,
	"ConnectionID" integer NOT NULL DEFAULT '0',
	"HitID" integer NOT NULL DEFAULT '0',
	"PrintID" integer NOT NULL DEFAULT '0',
	"UserID" integer NOT NULL DEFAULT '0',
	"Time" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"Value" float NOT NULL DEFAULT '0'
);

-- --------------------------------------------------------


--	Call_pri
--
--	All calls made from sites in this system.

CREATE TABLE Call_pri (
	"CallID" SERIAL PRIMARY KEY,
	"SiteID" integer NOT NULL DEFAULT '0',
	"PriKeyID" integer NOT NULL DEFAULT '0',
	"TimeStamp" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"ConnectionID" integer NOT NULL DEFAULT '0',
	"PrintID" integer NOT NULL DEFAULT '0',
	"UserID" integer NOT NULL DEFAULT '0',
	"HitID" integer NOT NULL DEFAULT '0',
	"IP" varchar(50) NOT NULL DEFAULT '',
	"BrowserID" integer NOT NULL DEFAULT '0',
	"BrowserString" text NOT NULL DEFAULT '',
	"Url" text NOT NULL DEFAULT '',
	"Sender" text NOT NULL DEFAULT '',
	"cmd" text NOT NULL DEFAULT '',
	"Value" float NOT NULL DEFAULT '0'
);

-- --------------------------------------------------------


--	IpData_pri
--
--	Listing of all IP addresses used to access this system and relevant GeoLocation data for them.

CREATE TABLE IpData_pri (
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

-- --------------------------------------------------------


--	Browser_pri
--
--	The various browser headers that have been received to this server.

CREATE TABLE Browser_pri (
	"BrowserID" SERIAL PRIMARY KEY,
	"Name" varchar(50) NOT NULL DEFAULT '',
	"Description" text NOT NULL DEFAULT '',
	"Header" text NOT NULL DEFAULT '',
	"Registered" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"Value" float NOT NULL DEFAULT '0'
);

INSERT INTO Browser_pri ("BrowserID", "Name", "Description") VALUES 
('1', 'Generic', 'The DEFAULT generic browser, html interface via any standards-compliant internet browser.');

-- --------------------------------------------------------


--	Device_pri
--
--	The various device profiles that have been received to this server.

CREATE TABLE Device_pri (
	"DeviceID" SERIAL PRIMARY KEY,
	"Name" varchar(50) NOT NULL DEFAULT '',
	"Description" text NOT NULL DEFAULT '',
	"Screen" text NOT NULL DEFAULT '',
	"Props" text NOT NULL DEFAULT '',
	"Vars" text NOT NULL DEFAULT '',
	"Registered" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"Value" float NOT NULL DEFAULT '0'
);

INSERT INTO Device_pri ("DeviceID", "Name", "Description") VALUES 
('1', 'Test Device', 'Not a real device. Generic interface, used for testing purposes.');

-- --------------------------------------------------------


--	Page_pri
--
--	Pages and views that can be accessed through a web site.

CREATE TABLE Page_pri (
	"NavID" SERIAL PRIMARY KEY,
	"SiteID" integer NOT NULL DEFAULT '0' REFERENCES Site_pri,
	"Name" varchar(50) NOT NULL DEFAULT '',
	"Description" text NOT NULL DEFAULT '',
	"Attributes" text NOT NULL DEFAULT '',
	"Code" varchar(50) NOT NULL DEFAULT '' UNIQUE,
	"Value" float NOT NULL DEFAULT '0'
);

-- --------------------------------------------------------



-- ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
-- User Items
-- ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++



--	User_pri
--
--	All registered users logged by this system.

CREATE TABLE User_pri (
	"UserID" SERIAL PRIMARY KEY,
	"Name" varchar(50) NOT NULL DEFAULT '',
	"SiteKey" varchar(50) NOT NULL DEFAULT '',
	"Description" text NOT NULL DEFAULT '',
	"Value" float NOT NULL DEFAULT '0'
);

INSERT INTO User_pri ("UserID", "Name", "SiteKey", "Description", "Value") VALUES 
('1', 'Generic User', 'fakeSiteKey', 'Not an actual user.  Used mainly for testing purposes.', '0');

-- --------------------------------------------------------


--	Print_pri
--
--	All temporary user profiles accessing this system. Will convert to actual user(s) when associated to account(s)

CREATE TABLE Print_pri (
	"PrintID" SERIAL PRIMARY KEY,
	"Name" varchar(50) NOT NULL DEFAULT '',
	"DeviceID" integer NOT NULL DEFAULT '0' REFERENCES Device_pri,
	"BrowserID" integer NOT NULL DEFAULT '0' REFERENCES Browser_pri,
	"Description" text NOT NULL DEFAULT '',
	"Value" float NOT NULL DEFAULT '0',
	"FirstAccessIP" varchar(50) NOT NULL DEFAULT '',
	"FirstAccessTime" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "DeviceID-index" ON Print_pri ("DeviceID" DESC NULLS LAST);
CREATE INDEX "BrowserID-index" ON Print_pri ("BrowserID" DESC NULLS LAST);

INSERT INTO Print_pri ("PrintID", "Name", "DeviceID", "BrowserID", "Description") VALUES 
('1000000', 'Test Print', '1', '1', 'Not an actual user.  Starts auto-increment at 1,000,000.');

-- --------------------------------------------------------


--	Print_User_ref
--
--	Links print profiles to registered Users.

CREATE TABLE Print_User_ref (
	"RefID" SERIAL PRIMARY KEY,
	"PrintID" integer NOT NULL DEFAULT '0' REFERENCES Print_pri,
	"UserID" integer NOT NULL DEFAULT '0' REFERENCES User_pri,
	"Value" float NOT NULL DEFAULT '0'
);

INSERT INTO Print_User_ref (RefID, PrintID, UserID, Value) VALUES 
('', '1000000', '1', '0');

-- --------------------------------------------------------


--	Print_IP_ref
--
--	Links fingerprint profiles to registered IP addresses.

CREATE TABLE Print_IP_ref (
	"RefID" SERIAL PRIMARY KEY,
	"PrintID" integer NOT NULL DEFAULT '0' REFERENCES Print_pri,
	"IpID" integer NOT NULL DEFAULT '0' REFERENCES IpData_pri,
	"Value" float NOT NULL DEFAULT '0'
);

INSERT INTO Print_IP_ref (RefID, PrintID, IpID, Value) VALUES 
('', '1000000', '1', '0');

-- --------------------------------------------------------


--	User_Prefs_pri
--
--	Links Users to their system preferences

CREATE TABLE User_prefs_pri (
	"UserPrefsID" SERIAL PRIMARY KEY,
	"UserID" integer NOT NULL DEFAULT '0',
	"TransitionSpeed" float NOT NULL DEFAULT '.25',
	"Cookies" varchar(50) NOT NULL DEFAULT '1',
	"Value" float NOT NULL DEFAULT '0'
);

INSERT INTO User_prefs_pri (UserPrefsID, UserID, TransitionSpeed, Cookies, Value) VALUES 
('', '1', '192.168.0.100', '1234567890', '0');

-- --------------------------------------------------------


--	Visit_log
--
--	All session visits made by users.

CREATE TABLE User_Visit_log (
	"LogID" SERIAL PRIMARY KEY,
	"PrintID" integer NOT NULL DEFAULT '0',
	"UserIP" varchar(50) NOT NULL DEFAULT '',
	"ConnectionID" integer NOT NULL DEFAULT '0',
	"UserID" integer NOT NULL DEFAULT '0',
	"SiteID" integer NOT NULL DEFAULT '0',
	"LoginTime" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"LogoutTime" timestamp NOT NULL DEFAULT 'epoch',
	"Value" float NOT NULL DEFAULT '0'
);

INSERT INTO User_Visit_log (LogID, PrintID, UserIP, ConnectionID, UserID, LoginTime, LogoutTime) VALUES 
('', '1', '76.181.64.210', '1234567890', '0', '0', '0');

-- --------------------------------------------------------


--	User_Nav_log
--
--	Logging navigation data for each step taken within the system.

CREATE TABLE User_Nav_log (
	"NavLogID" SERIAL PRIMARY KEY,
	"ConnectionID" integer NOT NULL DEFAULT '0',
	"PrintID" integer NOT NULL DEFAULT '0',
	"UserID" integer NOT NULL DEFAULT '0',
	"SiteID" integer NOT NULL DEFAULT '0',
	"url" text NOT NULL DEFAULT '',
	"NavID" integer NOT NULL DEFAULT '0',
	"Time" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"Value" float NOT NULL DEFAULT '0'
);

-- --------------------------------------------------------


--	Flag_typ
--
--	Various items that can be flagged to abstract complex behavior into simple markers. 

CREATE TABLE Flag_typ (
	"FlagTyp" SERIAL PRIMARY KEY,
	"Name" varchar(50) NOT NULL DEFAULT '',
	"Description" text NOT NULL DEFAULT '',
	"Code" varchar(10) NOT NULL DEFAULT '',
	"Value" float NOT NULL DEFAULT '0',
	UNIQUE (Code)
);

INSERT INTO Flag_typ (FlagTyp, Name, Description, Code, Value) VALUES 
('1', 'Hover', 'When a user hovers over an item but does not click on it.', '1', '0');

-- --------------------------------------------------------


--	TimeBlock_pri
--
--	A block of time, and associated items.

CREATE TABLE TimeBlock_pri (
	"TimeBlockID" SERIAL PRIMARY KEY,
	"PrintID" integer NOT NULL DEFAULT '0',
	"Name" varchar(50) NOT NULL DEFAULT '',
	"Description" text NOT NULL DEFAULT '',
	"Note" text NOT NULL DEFAULT '',
	"Date" date NOT NULL DEFAULT '0000-00-00',
	"StartTime" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"EndTime" timestamp NOT NULL DEFAULT 'epoch',
	"Less" timestamp NOT NULL DEFAULT '00:00:00',
	"More" timestamp NOT NULL DEFAULT '00:00:00',
	"Time" timestamp NOT NULL DEFAULT '00:00:00',
	"Value" float NOT NULL DEFAULT '0',
	PRIMARY KEY  ("TimeBlockID")
);

-- --------------------------------------------------------




