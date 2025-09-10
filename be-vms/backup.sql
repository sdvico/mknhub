--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: devices_platform_enum; Type: TYPE; Schema: public; Owner: root
--

CREATE TYPE public.devices_platform_enum AS ENUM (
    'ios',
    'android',
    'web'
);


ALTER TYPE public.devices_platform_enum OWNER TO root;

--
-- Name: notifications_type_enum; Type: TYPE; Schema: public; Owner: root
--

CREATE TYPE public.notifications_type_enum AS ENUM (
    'price_alert',
    'price_change',
    'system',
    'promotion'
);


ALTER TYPE public.notifications_type_enum OWNER TO root;

--
-- Name: price_stats_lastchangetype_enum; Type: TYPE; Schema: public; Owner: root
--

CREATE TYPE public.price_stats_lastchangetype_enum AS ENUM (
    'increase',
    'decrease',
    'no_change'
);


ALTER TYPE public.price_stats_lastchangetype_enum OWNER TO root;

--
-- Name: product_prices_changetype_enum; Type: TYPE; Schema: public; Owner: root
--

CREATE TYPE public.product_prices_changetype_enum AS ENUM (
    'increase',
    'decrease',
    'no_change'
);


ALTER TYPE public.product_prices_changetype_enum OWNER TO root;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: devices; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.devices (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "deviceToken" character varying NOT NULL,
    platform public.devices_platform_enum NOT NULL,
    "deviceName" character varying NOT NULL,
    "deviceModel" character varying,
    "osVersion" character varying,
    "appVersion" character varying,
    "isActive" boolean DEFAULT true NOT NULL,
    "notificationEnabled" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "userId" integer
);


ALTER TABLE public.devices OWNER TO root;

--
-- Name: file; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.file (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    path character varying NOT NULL
);


ALTER TABLE public.file OWNER TO root;

--
-- Name: follows; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.follows (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "notificationEnabled" boolean DEFAULT true NOT NULL,
    "priceThreshold" numeric(12,2),
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "userId" integer,
    "productId" uuid
);


ALTER TABLE public.follows OWNER TO root;

--
-- Name: migrations; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.migrations (
    id integer NOT NULL,
    "timestamp" bigint NOT NULL,
    name character varying NOT NULL
);


ALTER TABLE public.migrations OWNER TO root;

--
-- Name: migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.migrations_id_seq OWNER TO root;

--
-- Name: migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public.migrations_id_seq OWNED BY public.migrations.id;


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.notifications (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    title character varying NOT NULL,
    description text NOT NULL,
    type public.notifications_type_enum DEFAULT 'system'::public.notifications_type_enum NOT NULL,
    data jsonb,
    viewed boolean DEFAULT false NOT NULL,
    "viewedAt" timestamp without time zone,
    sent boolean DEFAULT false NOT NULL,
    "sentAt" timestamp without time zone,
    "errorMessage" character varying,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "userId" integer
);


ALTER TABLE public.notifications OWNER TO root;

--
-- Name: price_stats; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.price_stats (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "openPrice" numeric(12,2),
    "closePrice" numeric(12,2),
    high numeric(12,2),
    low numeric(12,2),
    "percentChange" numeric(6,2),
    volume numeric(12,2),
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "productId" uuid,
    province character varying NOT NULL,
    "tableId" character varying NOT NULL,
    "lastChange" character varying,
    "lastChangeType" public.price_stats_lastchangetype_enum,
    date timestamp without time zone NOT NULL
);


ALTER TABLE public.price_stats OWNER TO root;

--
-- Name: product_prices; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.product_prices (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    price numeric(12,2) NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "productId" uuid,
    province character varying NOT NULL,
    change character varying NOT NULL,
    "changeType" public.product_prices_changetype_enum NOT NULL,
    "tableId" character varying NOT NULL,
    currency character varying DEFAULT 'VND'::character varying NOT NULL,
    unit character varying DEFAULT 'kg'::character varying NOT NULL,
    "scrapedAt" timestamp without time zone NOT NULL
);


ALTER TABLE public.product_prices OWNER TO root;

--
-- Name: products; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.products (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying DEFAULT 'Cà phê'::character varying NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    code character varying DEFAULT 'CAFE'::character varying NOT NULL,
    country character varying DEFAULT 'Vietnam'::character varying NOT NULL
);


ALTER TABLE public.products OWNER TO root;

--
-- Name: rental_boarding_house; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.rental_boarding_house (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    address text NOT NULL,
    "userId" integer,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.rental_boarding_house OWNER TO root;

--
-- Name: rental_boarding_house_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.rental_boarding_house_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.rental_boarding_house_id_seq OWNER TO root;

--
-- Name: rental_boarding_house_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public.rental_boarding_house_id_seq OWNED BY public.rental_boarding_house.id;


--
-- Name: rental_extra_fees; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.rental_extra_fees (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    "defaultAmount" integer NOT NULL,
    type character varying(50) NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.rental_extra_fees OWNER TO root;

--
-- Name: rental_extra_fees_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.rental_extra_fees_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.rental_extra_fees_id_seq OWNER TO root;

--
-- Name: rental_extra_fees_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public.rental_extra_fees_id_seq OWNED BY public.rental_extra_fees.id;


--
-- Name: rental_invoice; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.rental_invoice (
    id integer NOT NULL,
    "rentalLogId" integer,
    "totalRent" integer NOT NULL,
    "electricityFee" integer NOT NULL,
    "waterFee" integer NOT NULL,
    "extraFee" integer NOT NULL,
    "totalAmount" integer NOT NULL,
    status character varying(50) DEFAULT 'unpaid'::character varying NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.rental_invoice OWNER TO root;

--
-- Name: rental_invoice_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.rental_invoice_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.rental_invoice_id_seq OWNER TO root;

--
-- Name: rental_invoice_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public.rental_invoice_id_seq OWNED BY public.rental_invoice.id;


--
-- Name: rental_log_extras; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.rental_log_extras (
    id integer NOT NULL,
    "rentalLogId" integer,
    "roomId" integer,
    "extraFeeId" integer,
    quantity integer NOT NULL,
    amount integer NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.rental_log_extras OWNER TO root;

--
-- Name: rental_log_extras_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.rental_log_extras_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.rental_log_extras_id_seq OWNER TO root;

--
-- Name: rental_log_extras_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public.rental_log_extras_id_seq OWNED BY public.rental_log_extras.id;


--
-- Name: rental_logs; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.rental_logs (
    id integer NOT NULL,
    "roomId" integer,
    month integer NOT NULL,
    year integer NOT NULL,
    "rentPrice" integer NOT NULL,
    "electricityOld" integer NOT NULL,
    "electricityNew" integer NOT NULL,
    "waterOld" integer NOT NULL,
    "waterNew" integer NOT NULL,
    note text,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.rental_logs OWNER TO root;

--
-- Name: rental_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.rental_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.rental_logs_id_seq OWNER TO root;

--
-- Name: rental_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public.rental_logs_id_seq OWNED BY public.rental_logs.id;


--
-- Name: rental_room; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.rental_room (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    "boardingHouseId" integer,
    area numeric(10,2) NOT NULL,
    "basePrice" integer NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.rental_room OWNER TO root;

--
-- Name: rental_room_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.rental_room_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.rental_room_id_seq OWNER TO root;

--
-- Name: rental_room_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public.rental_room_id_seq OWNED BY public.rental_room.id;


--
-- Name: rental_room_settings; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.rental_room_settings (
    id integer NOT NULL,
    "roomId" integer,
    "electricityPrice" integer NOT NULL,
    "waterPrice" integer NOT NULL,
    "effectiveFrom" timestamp without time zone NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.rental_room_settings OWNER TO root;

--
-- Name: rental_room_settings_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.rental_room_settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.rental_room_settings_id_seq OWNER TO root;

--
-- Name: rental_room_settings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public.rental_room_settings_id_seq OWNED BY public.rental_room_settings.id;


--
-- Name: role; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.role (
    id integer NOT NULL,
    name character varying NOT NULL
);


ALTER TABLE public.role OWNER TO root;

--
-- Name: session; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.session (
    id integer NOT NULL,
    hash character varying NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "deletedAt" timestamp without time zone,
    "userId" integer
);


ALTER TABLE public.session OWNER TO root;

--
-- Name: session_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.session_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.session_id_seq OWNER TO root;

--
-- Name: session_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public.session_id_seq OWNED BY public.session.id;


--
-- Name: status; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.status (
    id integer NOT NULL,
    name character varying NOT NULL
);


ALTER TABLE public.status OWNER TO root;

--
-- Name: user; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public."user" (
    id integer NOT NULL,
    email character varying,
    password character varying,
    provider character varying DEFAULT 'email'::character varying NOT NULL,
    "socialId" character varying,
    "firstName" character varying,
    "lastName" character varying,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "deletedAt" timestamp without time zone,
    "photoId" uuid,
    "roleId" integer,
    "statusId" integer
);


ALTER TABLE public."user" OWNER TO root;

--
-- Name: user_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_id_seq OWNER TO root;

--
-- Name: user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public.user_id_seq OWNED BY public."user".id;


--
-- Name: migrations id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.migrations ALTER COLUMN id SET DEFAULT nextval('public.migrations_id_seq'::regclass);


--
-- Name: rental_boarding_house id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.rental_boarding_house ALTER COLUMN id SET DEFAULT nextval('public.rental_boarding_house_id_seq'::regclass);


--
-- Name: rental_extra_fees id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.rental_extra_fees ALTER COLUMN id SET DEFAULT nextval('public.rental_extra_fees_id_seq'::regclass);


--
-- Name: rental_invoice id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.rental_invoice ALTER COLUMN id SET DEFAULT nextval('public.rental_invoice_id_seq'::regclass);


--
-- Name: rental_log_extras id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.rental_log_extras ALTER COLUMN id SET DEFAULT nextval('public.rental_log_extras_id_seq'::regclass);


--
-- Name: rental_logs id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.rental_logs ALTER COLUMN id SET DEFAULT nextval('public.rental_logs_id_seq'::regclass);


--
-- Name: rental_room id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.rental_room ALTER COLUMN id SET DEFAULT nextval('public.rental_room_id_seq'::regclass);


--
-- Name: rental_room_settings id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.rental_room_settings ALTER COLUMN id SET DEFAULT nextval('public.rental_room_settings_id_seq'::regclass);


--
-- Name: session id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.session ALTER COLUMN id SET DEFAULT nextval('public.session_id_seq'::regclass);


--
-- Name: user id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."user" ALTER COLUMN id SET DEFAULT nextval('public.user_id_seq'::regclass);


--
-- Data for Name: devices; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.devices (id, "deviceToken", platform, "deviceName", "deviceModel", "osVersion", "appVersion", "isActive", "notificationEnabled", "createdAt", "updatedAt", "userId") FROM stdin;
\.


--
-- Data for Name: file; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.file (id, path) FROM stdin;
\.


--
-- Data for Name: follows; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.follows (id, "isActive", "notificationEnabled", "priceThreshold", "createdAt", "userId", "productId") FROM stdin;
\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.migrations (id, "timestamp", name) FROM stdin;
1	1715028537217	CreateUser1715028537217
2	1751380592962	CreateProductTable1751380592962
3	1752538284664	AddCodeAndRegionToProducts1752538284664
4	1752538284665	AddCountryToProducts1752538284665
5	1752938076128	UpdateCoffeePriceStructure1752938076128
6	1752941740640	CreateFollowDeviceNotificationTables1752941740640
7	1752941740641	CreateRentalTables1752941740641
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.notifications (id, title, description, type, data, viewed, "viewedAt", sent, "sentAt", "errorMessage", "createdAt", "userId") FROM stdin;
\.


--
-- Data for Name: price_stats; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.price_stats (id, "openPrice", "closePrice", high, low, "percentChange", volume, "createdAt", "productId", province, "tableId", "lastChange", "lastChangeType", date) FROM stdin;
65b65da4-a191-4933-9ef4-95e2ff2f6326	93800.00	95500.00	144000.00	92300.00	0.00	\N	2025-07-21 15:26:54.413735	f108e88c-cb54-4757-b710-b11a21b9015d	Đắk Lắk	domestic_coffee	+3,200	increase	2025-07-21 15:26:54.348
def67ebc-992a-4966-89b9-c110e9fe76d3	93500.00	95300.00	95300.00	91600.00	0.00	\N	2025-07-21 15:26:54.442054	f108e88c-cb54-4757-b710-b11a21b9015d	Lâm Đồng	domestic_coffee	+3,700	increase	2025-07-21 15:26:54.424
0e8e793d-6a75-4411-abc8-7e56ef1aa5bd	93800.00	95500.00	95500.00	92200.00	0.00	\N	2025-07-21 15:26:54.463631	f108e88c-cb54-4757-b710-b11a21b9015d	Gia Lai	domestic_coffee	+3,300	increase	2025-07-21 15:26:54.449
45bc18a7-0a05-45db-9e63-fa4e8cf708d1	94000.00	95700.00	95700.00	92300.00	0.00	\N	2025-07-21 15:26:54.486391	f108e88c-cb54-4757-b710-b11a21b9015d	Đắk Nông	domestic_coffee	+3,400	increase	2025-07-21 15:26:54.471
73a3397b-b576-47fb-9d21-65f520dc3603	139000.00	139000.00	139000.00	139000.00	0.00	\N	2025-07-21 20:00:29.629298	f108e88c-cb54-4757-b710-b11a21b9015d	Giá tiêu	domestic_coffee	+1,000	increase	2025-07-21 20:00:29.618
\.


--
-- Data for Name: product_prices; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.product_prices (id, price, "createdAt", "productId", province, change, "changeType", "tableId", currency, unit, "scrapedAt") FROM stdin;
18151698-e283-4ae9-9075-7e54bdd1c192	93800.00	2025-07-21 15:26:54.365309	f108e88c-cb54-4757-b710-b11a21b9015d	Đắk Lắk	0	no_change	domestic_coffee	VND	đồng/kg	2025-07-21 15:26:54.348
dd38459f-8216-4cd7-bc2a-b0a121e204e8	93500.00	2025-07-21 15:26:54.428433	f108e88c-cb54-4757-b710-b11a21b9015d	Lâm Đồng	0	no_change	domestic_coffee	VND	đồng/kg	2025-07-21 15:26:54.424
500c0f7a-8cf1-4bda-bf44-f3ab4177d9bb	93800.00	2025-07-21 15:26:54.451962	f108e88c-cb54-4757-b710-b11a21b9015d	Gia Lai	0	no_change	domestic_coffee	VND	đồng/kg	2025-07-21 15:26:54.449
dd9763f9-ec19-4fb3-a253-166d80991d06	94000.00	2025-07-21 15:26:54.473927	f108e88c-cb54-4757-b710-b11a21b9015d	Đắk Nông	0	no_change	domestic_coffee	VND	đồng/kg	2025-07-21 15:26:54.471
f396da8d-82bc-46ac-86be-50c8ff5da59e	93800.00	2025-07-21 16:00:27.656484	f108e88c-cb54-4757-b710-b11a21b9015d	Đắk Lắk	0	no_change	domestic_coffee	VND	đồng/kg	2025-07-21 16:00:27.652
5f274c24-00a2-4fd4-b906-38b7c6391466	93500.00	2025-07-21 16:00:27.710132	f108e88c-cb54-4757-b710-b11a21b9015d	Lâm Đồng	0	no_change	domestic_coffee	VND	đồng/kg	2025-07-21 16:00:27.707
f4cf2c56-2d1d-4b0e-bbbe-62197ea984d2	93800.00	2025-07-21 16:00:27.734643	f108e88c-cb54-4757-b710-b11a21b9015d	Gia Lai	0	no_change	domestic_coffee	VND	đồng/kg	2025-07-21 16:00:27.732
8f92e2c2-051b-435b-beb1-fbfa721c5603	94000.00	2025-07-21 16:00:27.77366	f108e88c-cb54-4757-b710-b11a21b9015d	Đắk Nông	0	no_change	domestic_coffee	VND	đồng/kg	2025-07-21 16:00:27.77
578b4bc1-60cf-46ca-9490-d7ab4a2c01cd	144000.00	2025-07-21 16:00:40.87402	f108e88c-cb54-4757-b710-b11a21b9015d	Đắk Lắk	+1,000	increase	domestic_coffee	VND	đồng/kg	2025-07-21 16:00:40.871
92a3b7b3-c964-4868-aa79-70d4c345dab4	93500.00	2025-07-21 16:00:40.934888	f108e88c-cb54-4757-b710-b11a21b9015d	Lâm Đồng	0	no_change	domestic_coffee	VND	đồng/kg	2025-07-21 16:00:40.932
3d63b28f-79ae-4b0e-92dd-3d4d52ae2bb8	93800.00	2025-07-21 16:00:40.96099	f108e88c-cb54-4757-b710-b11a21b9015d	Gia Lai	0	no_change	domestic_coffee	VND	đồng/kg	2025-07-21 16:00:40.958
e4963494-ad7e-4be2-8901-29ab0940ea21	94000.00	2025-07-21 16:00:40.983972	f108e88c-cb54-4757-b710-b11a21b9015d	Đắk Nông	0	no_change	domestic_coffee	VND	đồng/kg	2025-07-21 16:00:40.982
4af6bc89-4977-4d11-bd32-2f00cf01dfe9	93800.00	2025-07-21 17:00:33.461761	f108e88c-cb54-4757-b710-b11a21b9015d	Đắk Lắk	0	no_change	domestic_coffee	VND	đồng/kg	2025-07-21 17:00:33.459
b521614d-47ea-42e4-8c34-5345ff86758b	93500.00	2025-07-21 17:00:33.500139	f108e88c-cb54-4757-b710-b11a21b9015d	Lâm Đồng	0	no_change	domestic_coffee	VND	đồng/kg	2025-07-21 17:00:33.497
2d72628f-ca00-4a3e-8ec0-bace0ef13d5b	93800.00	2025-07-21 17:00:33.524363	f108e88c-cb54-4757-b710-b11a21b9015d	Gia Lai	0	no_change	domestic_coffee	VND	đồng/kg	2025-07-21 17:00:33.522
0b354553-3b75-4d51-8bca-1c1fe93dcdde	94000.00	2025-07-21 17:00:33.549136	f108e88c-cb54-4757-b710-b11a21b9015d	Đắk Nông	0	no_change	domestic_coffee	VND	đồng/kg	2025-07-21 17:00:33.546
0c99cef3-df1e-4eeb-8dbc-0383c576ce6a	93800.00	2025-07-21 17:00:36.102526	f108e88c-cb54-4757-b710-b11a21b9015d	Đắk Lắk	0	no_change	domestic_coffee	VND	đồng/kg	2025-07-21 17:00:36.1
cd122451-edb2-406d-a80a-ab01ca42beee	93500.00	2025-07-21 17:00:36.124512	f108e88c-cb54-4757-b710-b11a21b9015d	Lâm Đồng	0	no_change	domestic_coffee	VND	đồng/kg	2025-07-21 17:00:36.122
6c3a1171-57a7-489d-9ef9-136f5b0048d5	93800.00	2025-07-21 17:00:36.145819	f108e88c-cb54-4757-b710-b11a21b9015d	Gia Lai	0	no_change	domestic_coffee	VND	đồng/kg	2025-07-21 17:00:36.144
075d0a69-ba56-4222-b682-6c3dc08b47a8	94000.00	2025-07-21 17:00:36.168207	f108e88c-cb54-4757-b710-b11a21b9015d	Đắk Nông	0	no_change	domestic_coffee	VND	đồng/kg	2025-07-21 17:00:36.166
e517dd4f-babb-4fb0-96ce-748a309427a3	93800.00	2025-07-21 18:00:31.406379	f108e88c-cb54-4757-b710-b11a21b9015d	Đắk Lắk	0	no_change	domestic_coffee	VND	đồng/kg	2025-07-21 18:00:31.404
a9d5c84a-de46-4e0a-bffa-c8031f9e7018	93500.00	2025-07-21 18:00:31.440768	f108e88c-cb54-4757-b710-b11a21b9015d	Lâm Đồng	0	no_change	domestic_coffee	VND	đồng/kg	2025-07-21 18:00:31.438
42cd3251-fe98-4f9a-8575-0c10c438b550	93800.00	2025-07-21 18:00:31.466248	f108e88c-cb54-4757-b710-b11a21b9015d	Gia Lai	0	no_change	domestic_coffee	VND	đồng/kg	2025-07-21 18:00:31.464
7cacdb78-5b89-4894-96ba-a0959e818ea1	94000.00	2025-07-21 18:00:31.489133	f108e88c-cb54-4757-b710-b11a21b9015d	Đắk Nông	0	no_change	domestic_coffee	VND	đồng/kg	2025-07-21 18:00:31.487
a68f8dfa-9b08-42d7-82a6-e26611efe719	94000.00	2025-07-21 18:00:39.67328	f108e88c-cb54-4757-b710-b11a21b9015d	Đắk Lắk	0	no_change	domestic_coffee	VND	đồng/kg	2025-07-21 18:00:39.671
2aa2bbab-197f-47f6-b2d3-1af32f785936	93500.00	2025-07-21 18:00:39.696984	f108e88c-cb54-4757-b710-b11a21b9015d	Lâm Đồng	0	no_change	domestic_coffee	VND	đồng/kg	2025-07-21 18:00:39.695
b84bd4da-9a44-4209-8b04-176664f4cde7	93800.00	2025-07-21 18:00:39.720279	f108e88c-cb54-4757-b710-b11a21b9015d	Gia Lai	0	no_change	domestic_coffee	VND	đồng/kg	2025-07-21 18:00:39.718
fc7f78f1-a293-4ca4-9599-123df2e2135f	94000.00	2025-07-21 18:00:39.745221	f108e88c-cb54-4757-b710-b11a21b9015d	Đắk Nông	0	no_change	domestic_coffee	VND	đồng/kg	2025-07-21 18:00:39.742
218f1f9f-c5cb-4c34-9a0b-009f21475f3e	93800.00	2025-07-21 19:00:30.254184	f108e88c-cb54-4757-b710-b11a21b9015d	Đắk Lắk	0	no_change	domestic_coffee	VND	đồng/kg	2025-07-21 19:00:30.251
39352cfa-57d5-43e2-9cc2-b927faa262a3	93500.00	2025-07-21 19:00:30.288735	f108e88c-cb54-4757-b710-b11a21b9015d	Lâm Đồng	0	no_change	domestic_coffee	VND	đồng/kg	2025-07-21 19:00:30.286
02fccfec-8e79-4a0e-8543-57af72f15647	93800.00	2025-07-21 19:00:30.311465	f108e88c-cb54-4757-b710-b11a21b9015d	Gia Lai	0	no_change	domestic_coffee	VND	đồng/kg	2025-07-21 19:00:30.309
47fc9295-dc6a-419e-8e40-64e0d0a88b63	94000.00	2025-07-21 19:00:30.334428	f108e88c-cb54-4757-b710-b11a21b9015d	Đắk Nông	0	no_change	domestic_coffee	VND	đồng/kg	2025-07-21 19:00:30.332
ae5633da-80e8-4353-bb59-4cc409133018	93800.00	2025-07-21 19:00:33.133693	f108e88c-cb54-4757-b710-b11a21b9015d	Đắk Lắk	0	no_change	domestic_coffee	VND	đồng/kg	2025-07-21 19:00:33.131
150660a3-a899-4bf9-80d0-6248b97d23a7	93500.00	2025-07-21 19:00:33.160493	f108e88c-cb54-4757-b710-b11a21b9015d	Lâm Đồng	0	no_change	domestic_coffee	VND	đồng/kg	2025-07-21 19:00:33.158
c382f287-8efc-4b8f-b1de-835dacd06984	93800.00	2025-07-21 19:00:33.180808	f108e88c-cb54-4757-b710-b11a21b9015d	Gia Lai	0	no_change	domestic_coffee	VND	đồng/kg	2025-07-21 19:00:33.179
c6cd3578-57d4-4cee-8d31-2f2313ad09ba	94000.00	2025-07-21 19:00:33.202839	f108e88c-cb54-4757-b710-b11a21b9015d	Đắk Nông	0	no_change	domestic_coffee	VND	đồng/kg	2025-07-21 19:00:33.201
12cc86d1-7f24-4396-b15a-b79ddae53589	94000.00	2025-07-21 20:00:29.518895	f108e88c-cb54-4757-b710-b11a21b9015d	Đắk Lắk	0	no_change	domestic_coffee	VND	đồng/kg	2025-07-21 20:00:29.516
3bbd616d-0398-446e-b7fb-24ead57e637c	93500.00	2025-07-21 20:00:29.552982	f108e88c-cb54-4757-b710-b11a21b9015d	Lâm Đồng	0	no_change	domestic_coffee	VND	đồng/kg	2025-07-21 20:00:29.551
6d28a601-7b88-4638-86e9-77de2eb27230	93800.00	2025-07-21 20:00:29.575158	f108e88c-cb54-4757-b710-b11a21b9015d	Gia Lai	0	no_change	domestic_coffee	VND	đồng/kg	2025-07-21 20:00:29.573
8ffd5b36-175d-4ba2-bebc-09ac5ffe99f6	94000.00	2025-07-21 20:00:29.597163	f108e88c-cb54-4757-b710-b11a21b9015d	Đắk Nông	0	no_change	domestic_coffee	VND	đồng/kg	2025-07-21 20:00:29.595
50bdc286-6603-4ce3-8d05-73beeb832e9c	139000.00	2025-07-21 20:00:29.619903	f108e88c-cb54-4757-b710-b11a21b9015d	Giá tiêu	+1,000	increase	domestic_coffee	VND	đồng/kg	2025-07-21 20:00:29.618
f612756e-37bb-46c3-8e50-4dc1090a3ce7	144000.00	2025-07-21 20:00:33.627102	f108e88c-cb54-4757-b710-b11a21b9015d	Đắk Lắk	+1,000	increase	domestic_coffee	VND	đồng/kg	2025-07-21 20:00:33.624
9e31f577-e5fe-422b-ae07-d6aca560a206	93500.00	2025-07-21 20:00:33.679783	f108e88c-cb54-4757-b710-b11a21b9015d	Lâm Đồng	0	no_change	domestic_coffee	VND	đồng/kg	2025-07-21 20:00:33.677
2b4f68b9-de02-42cb-ae37-5f685774bfd0	93800.00	2025-07-21 20:00:33.704642	f108e88c-cb54-4757-b710-b11a21b9015d	Gia Lai	0	no_change	domestic_coffee	VND	đồng/kg	2025-07-21 20:00:33.702
f8763a0a-a4aa-4ed2-8d7f-329b1c95a6b2	94000.00	2025-07-21 20:00:33.727282	f108e88c-cb54-4757-b710-b11a21b9015d	Đắk Nông	0	no_change	domestic_coffee	VND	đồng/kg	2025-07-21 20:00:33.725
d7df7c4e-36fc-4091-97cc-068baab0af46	93800.00	2025-07-21 21:00:33.253221	f108e88c-cb54-4757-b710-b11a21b9015d	Đắk Lắk	0	no_change	domestic_coffee	VND	đồng/kg	2025-07-21 21:00:33.251
15af1e73-a061-4294-a9f5-1cd50628177b	93500.00	2025-07-21 21:00:33.290709	f108e88c-cb54-4757-b710-b11a21b9015d	Lâm Đồng	0	no_change	domestic_coffee	VND	đồng/kg	2025-07-21 21:00:33.288
e25f4e25-9d19-434f-aebb-7a6272f3bb0c	93800.00	2025-07-21 21:00:33.317554	f108e88c-cb54-4757-b710-b11a21b9015d	Gia Lai	0	no_change	domestic_coffee	VND	đồng/kg	2025-07-21 21:00:33.315
50264389-a06d-4866-a348-ed4e5177e334	94000.00	2025-07-21 21:00:33.339689	f108e88c-cb54-4757-b710-b11a21b9015d	Đắk Nông	0	no_change	domestic_coffee	VND	đồng/kg	2025-07-21 21:00:33.337
85231421-202d-4f4f-9eca-a7cc41a128aa	93800.00	2025-07-21 21:00:38.363738	f108e88c-cb54-4757-b710-b11a21b9015d	Đắk Lắk	+0	increase	domestic_coffee	VND	đồng/kg	2025-07-21 21:00:38.361
33cd073f-c4e0-4bae-9422-9a1a3c82816f	93500.00	2025-07-21 21:00:38.407131	f108e88c-cb54-4757-b710-b11a21b9015d	Lâm Đồng	+0	increase	domestic_coffee	VND	đồng/kg	2025-07-21 21:00:38.405
a6354a67-574d-452a-9789-da193a2cc0bd	93800.00	2025-07-21 21:00:38.442117	f108e88c-cb54-4757-b710-b11a21b9015d	Gia Lai	+0	increase	domestic_coffee	VND	đồng/kg	2025-07-21 21:00:38.44
f8c15894-6044-45c6-a081-9b6adaf3bb27	94000.00	2025-07-21 21:00:38.475727	f108e88c-cb54-4757-b710-b11a21b9015d	Đắk Nông	+0	increase	domestic_coffee	VND	đồng/kg	2025-07-21 21:00:38.474
c321cf4a-253d-42d5-86cd-442bd01cde14	93800.00	2025-07-21 22:00:26.836898	f108e88c-cb54-4757-b710-b11a21b9015d	Đắk Lắk	0	no_change	domestic_coffee	VND	đồng/kg	2025-07-21 22:00:26.833
72918d37-a602-412c-ac3c-2bc6c33847c3	93500.00	2025-07-21 22:00:26.878033	f108e88c-cb54-4757-b710-b11a21b9015d	Lâm Đồng	0	no_change	domestic_coffee	VND	đồng/kg	2025-07-21 22:00:26.875
7bdec819-253e-4391-8e30-b8b397f03d01	93800.00	2025-07-21 22:00:26.903138	f108e88c-cb54-4757-b710-b11a21b9015d	Gia Lai	0	no_change	domestic_coffee	VND	đồng/kg	2025-07-21 22:00:26.9
b5c2a991-b93f-46c6-b76b-3309253232f2	94000.00	2025-07-21 22:00:26.926157	f108e88c-cb54-4757-b710-b11a21b9015d	Đắk Nông	0	no_change	domestic_coffee	VND	đồng/kg	2025-07-21 22:00:26.924
b3a24e3b-1291-4a9d-950e-c7f858dd43d8	93800.00	2025-07-21 22:00:37.122197	f108e88c-cb54-4757-b710-b11a21b9015d	Đắk Lắk	0	no_change	domestic_coffee	VND	đồng/kg	2025-07-21 22:00:37.12
25262acd-c968-46a1-8d7a-08bbcce1426e	93500.00	2025-07-21 22:00:37.15827	f108e88c-cb54-4757-b710-b11a21b9015d	Lâm Đồng	0	no_change	domestic_coffee	VND	đồng/kg	2025-07-21 22:00:37.156
f7b5ee73-fb6c-4e30-aed3-76f5abdbedc0	93800.00	2025-07-21 22:00:37.180729	f108e88c-cb54-4757-b710-b11a21b9015d	Gia Lai	0	no_change	domestic_coffee	VND	đồng/kg	2025-07-21 22:00:37.178
2f0e3ba7-ce1f-421d-926e-9d8ad85364c3	94000.00	2025-07-21 22:00:37.201939	f108e88c-cb54-4757-b710-b11a21b9015d	Đắk Nông	0	no_change	domestic_coffee	VND	đồng/kg	2025-07-21 22:00:37.199
7ce55cf1-06d4-4121-b7f7-a2d3a6eca063	144000.00	2025-07-21 23:00:31.450469	f108e88c-cb54-4757-b710-b11a21b9015d	Đắk Lắk	+1,000	increase	domestic_coffee	VND	đồng/kg	2025-07-21 23:00:31.448
8230b04a-28d6-4d68-8bfa-ef6dd27c10b3	93500.00	2025-07-21 23:00:31.507237	f108e88c-cb54-4757-b710-b11a21b9015d	Lâm Đồng	0	no_change	domestic_coffee	VND	đồng/kg	2025-07-21 23:00:31.505
b9f174ff-dc75-44d8-89fe-8413f95355b1	93800.00	2025-07-21 23:00:31.547606	f108e88c-cb54-4757-b710-b11a21b9015d	Gia Lai	0	no_change	domestic_coffee	VND	đồng/kg	2025-07-21 23:00:31.541
f3e191d3-60b2-4b91-adf6-84760d27b9c8	94000.00	2025-07-21 23:00:31.607843	f108e88c-cb54-4757-b710-b11a21b9015d	Đắk Nông	0	no_change	domestic_coffee	VND	đồng/kg	2025-07-21 23:00:31.604
bc0f45f5-c271-4fc3-80fc-c65233146623	93800.00	2025-07-21 23:00:35.838025	f108e88c-cb54-4757-b710-b11a21b9015d	Đắk Lắk	0	no_change	domestic_coffee	VND	đồng/kg	2025-07-21 23:00:35.835
31c8de43-59ef-40d7-8386-17291b3afc0d	93500.00	2025-07-21 23:00:35.863612	f108e88c-cb54-4757-b710-b11a21b9015d	Lâm Đồng	0	no_change	domestic_coffee	VND	đồng/kg	2025-07-21 23:00:35.861
d1be7660-5fd6-4a80-a9b1-89bddd57490c	93800.00	2025-07-21 23:00:35.885846	f108e88c-cb54-4757-b710-b11a21b9015d	Gia Lai	0	no_change	domestic_coffee	VND	đồng/kg	2025-07-21 23:00:35.884
86dbc8f6-a541-42ad-9f5c-b7ee5a9ab76a	94000.00	2025-07-21 23:00:35.908809	f108e88c-cb54-4757-b710-b11a21b9015d	Đắk Nông	0	no_change	domestic_coffee	VND	đồng/kg	2025-07-21 23:00:35.907
24698c2b-496c-4fe3-aeef-4af8f15a2412	144000.00	2025-07-22 00:00:43.535876	f108e88c-cb54-4757-b710-b11a21b9015d	Đắk Lắk	+1,000	increase	domestic_coffee	VND	đồng/kg	2025-07-22 00:00:43.533
22636fed-e03b-49ad-a1a5-81542ae8ac58	93500.00	2025-07-22 00:00:43.595251	f108e88c-cb54-4757-b710-b11a21b9015d	Lâm Đồng	0	no_change	domestic_coffee	VND	đồng/kg	2025-07-22 00:00:43.593
19e241fc-ed19-4970-8952-0130079ed489	93800.00	2025-07-22 00:00:43.618139	f108e88c-cb54-4757-b710-b11a21b9015d	Gia Lai	0	no_change	domestic_coffee	VND	đồng/kg	2025-07-22 00:00:43.616
4bcfc7c3-6b22-4dc5-ae40-fcedf6b9270e	94000.00	2025-07-22 00:00:43.638274	f108e88c-cb54-4757-b710-b11a21b9015d	Đắk Nông	0	no_change	domestic_coffee	VND	đồng/kg	2025-07-22 00:00:43.636
c490f5e3-cccd-4d7f-90b7-dbc150af7787	144000.00	2025-07-22 00:00:47.451356	f108e88c-cb54-4757-b710-b11a21b9015d	Đắk Lắk	+1,000	increase	domestic_coffee	VND	đồng/kg	2025-07-22 00:00:47.449
9fc4e5a5-594e-4a1a-9a40-80aa7b73e114	93500.00	2025-07-22 00:00:47.486161	f108e88c-cb54-4757-b710-b11a21b9015d	Lâm Đồng	0	no_change	domestic_coffee	VND	đồng/kg	2025-07-22 00:00:47.483
aad01273-f075-40ac-a299-ec48f15eb064	93800.00	2025-07-22 00:00:47.513758	f108e88c-cb54-4757-b710-b11a21b9015d	Gia Lai	0	no_change	domestic_coffee	VND	đồng/kg	2025-07-22 00:00:47.51
71b79849-9460-42ab-8653-ec61956768e4	94000.00	2025-07-22 00:00:47.536337	f108e88c-cb54-4757-b710-b11a21b9015d	Đắk Nông	0	no_change	domestic_coffee	VND	đồng/kg	2025-07-22 00:00:47.534
befb8ed7-f826-4633-8775-cafff356018d	93800.00	2025-07-22 01:00:31.147755	f108e88c-cb54-4757-b710-b11a21b9015d	Đắk Lắk	0	no_change	domestic_coffee	VND	đồng/kg	2025-07-22 01:00:31.145
b6ed6c2d-52f6-4a44-a235-011352d248bc	93500.00	2025-07-22 01:00:31.181946	f108e88c-cb54-4757-b710-b11a21b9015d	Lâm Đồng	0	no_change	domestic_coffee	VND	đồng/kg	2025-07-22 01:00:31.179
4b18de6e-3da7-409b-abe3-f078cf1e5b41	93800.00	2025-07-22 01:00:31.20774	f108e88c-cb54-4757-b710-b11a21b9015d	Gia Lai	0	no_change	domestic_coffee	VND	đồng/kg	2025-07-22 01:00:31.206
687b1ca8-1584-470f-bc80-3e4eead98d34	94000.00	2025-07-22 01:00:31.228857	f108e88c-cb54-4757-b710-b11a21b9015d	Đắk Nông	0	no_change	domestic_coffee	VND	đồng/kg	2025-07-22 01:00:31.227
5f82a57f-fc4c-42e5-b4f6-31fc03fd6682	94000.00	2025-07-22 01:00:35.275011	f108e88c-cb54-4757-b710-b11a21b9015d	Đắk Lắk	0	no_change	domestic_coffee	VND	đồng/kg	2025-07-22 01:00:35.273
deda0c79-d14f-496b-a81a-0b0b2b6aa58c	93500.00	2025-07-22 01:00:35.296341	f108e88c-cb54-4757-b710-b11a21b9015d	Lâm Đồng	0	no_change	domestic_coffee	VND	đồng/kg	2025-07-22 01:00:35.294
89446c03-71b6-48fb-89b7-a226db7652e4	93800.00	2025-07-22 01:00:35.317182	f108e88c-cb54-4757-b710-b11a21b9015d	Gia Lai	0	no_change	domestic_coffee	VND	đồng/kg	2025-07-22 01:00:35.315
da621e01-ad53-4ce6-8934-3ef724f2b6d2	94000.00	2025-07-22 01:00:35.337765	f108e88c-cb54-4757-b710-b11a21b9015d	Đắk Nông	0	no_change	domestic_coffee	VND	đồng/kg	2025-07-22 01:00:35.336
018259a4-d90a-4ab0-a1d1-27053a6d6590	92300.00	2025-07-22 06:00:31.778963	f108e88c-cb54-4757-b710-b11a21b9015d	Đắk Lắk	-1,500	decrease	domestic_coffee	VND	đồng/kg	2025-07-22 06:00:31.763
6394e067-55c5-48a0-bd4a-5b312aa851ef	91600.00	2025-07-22 06:00:31.90756	f108e88c-cb54-4757-b710-b11a21b9015d	Lâm Đồng	-1,900	decrease	domestic_coffee	VND	đồng/kg	2025-07-22 06:00:31.904
02f25a9c-ba03-485f-8872-61e6b58e4dba	92200.00	2025-07-22 06:00:31.95008	f108e88c-cb54-4757-b710-b11a21b9015d	Gia Lai	-1,600	decrease	domestic_coffee	VND	đồng/kg	2025-07-22 06:00:31.947
4ff6e613-bb6f-46dc-b766-e7dd4872f58c	92300.00	2025-07-22 06:00:31.988869	f108e88c-cb54-4757-b710-b11a21b9015d	Đắk Nông	unchanged	no_change	domestic_coffee	VND	đồng/kg	2025-07-22 06:00:31.987
d7958ee5-e241-4a33-8452-a31b1adc5f57	92300.00	2025-07-22 06:00:36.06639	f108e88c-cb54-4757-b710-b11a21b9015d	Đắk Lắk	-1,500	decrease	domestic_coffee	VND	đồng/kg	2025-07-22 06:00:36.062
9377aaf3-58e2-4afc-aa2c-01f0c86493de	91600.00	2025-07-22 06:00:36.105971	f108e88c-cb54-4757-b710-b11a21b9015d	Lâm Đồng	-1,900	decrease	domestic_coffee	VND	đồng/kg	2025-07-22 06:00:36.104
2526284c-24aa-4f78-a365-900acc79656e	92200.00	2025-07-22 06:00:36.141251	f108e88c-cb54-4757-b710-b11a21b9015d	Gia Lai	-1,600	decrease	domestic_coffee	VND	đồng/kg	2025-07-22 06:00:36.139
49bddcbf-4601-4a49-aa3c-3c0798f7ca35	92300.00	2025-07-22 06:00:36.174147	f108e88c-cb54-4757-b710-b11a21b9015d	Đắk Nông	N/A	no_change	domestic_coffee	VND	đồng/kg	2025-07-22 06:00:36.172
a3aee328-1aea-4dc9-b877-a44e9fa401b8	92300.00	2025-07-22 12:00:34.307499	f108e88c-cb54-4757-b710-b11a21b9015d	Đắk Lắk	-1,500	decrease	domestic_coffee	VND	đồng/kg	2025-07-22 12:00:34.305
88a4abdb-4c45-4fef-9612-44fa54ecdd3a	91600.00	2025-07-22 12:00:34.366279	f108e88c-cb54-4757-b710-b11a21b9015d	Lâm Đồng	-1,900	decrease	domestic_coffee	VND	đồng/kg	2025-07-22 12:00:34.364
af723674-6b08-44ca-bbdf-13afd92a89d9	92200.00	2025-07-22 12:00:34.403403	f108e88c-cb54-4757-b710-b11a21b9015d	Gia Lai	-1,600	decrease	domestic_coffee	VND	đồng/kg	2025-07-22 12:00:34.401
5d9a621e-4b64-41cc-85c0-169e2aebb0ae	92300.00	2025-07-22 12:00:34.43826	f108e88c-cb54-4757-b710-b11a21b9015d	Đắk Nông	N/A	no_change	domestic_coffee	VND	đồng/kg	2025-07-22 12:00:34.436
c04b9579-08b9-40f4-a19b-0156c4e363ef	92300.00	2025-07-22 12:00:37.82933	f108e88c-cb54-4757-b710-b11a21b9015d	Đắk Lắk	-1,500	decrease	domestic_coffee	VND	đồng/kg	2025-07-22 12:00:37.827
e7904bd4-4a3f-44d6-8de0-7f4cb8851321	91600.00	2025-07-22 12:00:37.867439	f108e88c-cb54-4757-b710-b11a21b9015d	Lâm Đồng	-1,900	decrease	domestic_coffee	VND	đồng/kg	2025-07-22 12:00:37.865
de63ec29-07eb-48b0-8c0a-95e2b59a3d20	92200.00	2025-07-22 12:00:37.90328	f108e88c-cb54-4757-b710-b11a21b9015d	Gia Lai	-1,600	decrease	domestic_coffee	VND	đồng/kg	2025-07-22 12:00:37.9
66eede4b-29fa-42a0-aae7-99ecd56b491a	92300.00	2025-07-22 12:00:37.937276	f108e88c-cb54-4757-b710-b11a21b9015d	Đắk Nông	~1,700	no_change	domestic_coffee	VND	đồng/kg	2025-07-22 12:00:37.935
2337de42-4a9f-4201-9a1d-b110c01bba09	92300.00	2025-07-22 18:00:32.379509	f108e88c-cb54-4757-b710-b11a21b9015d	Đắk Lắk	-1,500	decrease	domestic_coffee	VND	đồng/kg	2025-07-22 18:00:32.376
9bd4c66e-347f-4b93-93af-02cc70891f27	91600.00	2025-07-22 18:00:32.442978	f108e88c-cb54-4757-b710-b11a21b9015d	Lâm Đồng	-1,900	decrease	domestic_coffee	VND	đồng/kg	2025-07-22 18:00:32.441
dab16071-d6de-450e-a9aa-e46d024b20c8	92200.00	2025-07-22 18:00:32.476818	f108e88c-cb54-4757-b710-b11a21b9015d	Gia Lai	-1,600	decrease	domestic_coffee	VND	đồng/kg	2025-07-22 18:00:32.474
61764964-797c-4fa7-a189-4a91ed594e47	92300.00	2025-07-22 18:00:32.515076	f108e88c-cb54-4757-b710-b11a21b9015d	Đắk Nông	N/A	no_change	domestic_coffee	VND	đồng/kg	2025-07-22 18:00:32.513
90151bd2-f96f-42fa-94ea-2e7bda84be08	144000.00	2025-07-22 18:00:36.200109	f108e88c-cb54-4757-b710-b11a21b9015d	Đắk Lắk	+1,000	increase	domestic_coffee	VND	đồng/kg	2025-07-22 18:00:36.198
f0b3e36c-99c7-4b03-9651-d51c7527d4f8	91600.00	2025-07-22 18:00:36.243746	f108e88c-cb54-4757-b710-b11a21b9015d	Lâm Đồng	-1,900	decrease	domestic_coffee	VND	đồng/kg	2025-07-22 18:00:36.241
7b48216b-eae4-40dd-8022-379fc7290434	92200.00	2025-07-22 18:00:36.280485	f108e88c-cb54-4757-b710-b11a21b9015d	Gia Lai	-1,600	decrease	domestic_coffee	VND	đồng/kg	2025-07-22 18:00:36.278
6be5a8a2-4ba8-4017-9e18-1c2713af75df	92300.00	2025-07-22 18:00:36.316224	f108e88c-cb54-4757-b710-b11a21b9015d	Đắk Nông	N/A	no_change	domestic_coffee	VND	đồng/kg	2025-07-22 18:00:36.313
97996926-dd63-45e0-b44a-7fcd252116a7	92300.00	2025-07-23 00:00:30.615504	f108e88c-cb54-4757-b710-b11a21b9015d	Đắk Lắk	-1,500	decrease	domestic_coffee	VND	đồng/kg	2025-07-23 00:00:30.613
cfbd5371-fdb7-4964-b834-20472857c01a	91600.00	2025-07-23 00:00:30.67187	f108e88c-cb54-4757-b710-b11a21b9015d	Lâm Đồng	-1,900	decrease	domestic_coffee	VND	đồng/kg	2025-07-23 00:00:30.67
28ff7251-38be-49ab-93a0-06d1ac0f68d7	92200.00	2025-07-23 00:00:30.707237	f108e88c-cb54-4757-b710-b11a21b9015d	Gia Lai	-1,600	decrease	domestic_coffee	VND	đồng/kg	2025-07-23 00:00:30.705
1ea21631-567e-4acf-8c66-1f5212b970ad	92300.00	2025-07-23 00:00:30.741015	f108e88c-cb54-4757-b710-b11a21b9015d	Đắk Nông	~1,700	no_change	domestic_coffee	VND	đồng/kg	2025-07-23 00:00:30.739
d5bfafd8-b755-46e3-b574-0ab9a06b20b5	92300.00	2025-07-23 00:00:36.796728	f108e88c-cb54-4757-b710-b11a21b9015d	Đắk Lắk	-1,500	decrease	domestic_coffee	VND	đồng/kg	2025-07-23 00:00:36.795
e13efc5b-b233-4c70-b886-71aea7793ebf	91600.00	2025-07-23 00:00:36.832009	f108e88c-cb54-4757-b710-b11a21b9015d	Lâm Đồng	-1,900	decrease	domestic_coffee	VND	đồng/kg	2025-07-23 00:00:36.829
765be9dd-879c-4452-b6b5-4f8f29c36117	92200.00	2025-07-23 00:00:36.869927	f108e88c-cb54-4757-b710-b11a21b9015d	Gia Lai	-1,600	decrease	domestic_coffee	VND	đồng/kg	2025-07-23 00:00:36.868
7831715a-d96b-4350-9fd3-5fddd7830473	92300.00	2025-07-23 00:00:36.905004	f108e88c-cb54-4757-b710-b11a21b9015d	Đắk Nông	NA	no_change	domestic_coffee	VND	đồng/kg	2025-07-23 00:00:36.903
bd52d1bd-592c-44cb-944b-8588ef4cf2bf	95500.00	2025-07-23 06:00:30.402726	f108e88c-cb54-4757-b710-b11a21b9015d	Đắk Lắk	+3,200	increase	domestic_coffee	VND	đồng/kg	2025-07-23 06:00:30.4
9e9bb330-4dcf-4aaa-a8e1-1a7148a9fe5f	95300.00	2025-07-23 06:00:30.457879	f108e88c-cb54-4757-b710-b11a21b9015d	Lâm Đồng	+3,700	increase	domestic_coffee	VND	đồng/kg	2025-07-23 06:00:30.456
764d429d-73d4-428e-a177-dab64b28964c	95500.00	2025-07-23 06:00:30.491177	f108e88c-cb54-4757-b710-b11a21b9015d	Gia Lai	+3,300	increase	domestic_coffee	VND	đồng/kg	2025-07-23 06:00:30.489
dc6c04fb-82bd-45c8-a27a-d2b60c58b3b4	95700.00	2025-07-23 06:00:30.546021	f108e88c-cb54-4757-b710-b11a21b9015d	Đắk Nông	+3,400	increase	domestic_coffee	VND	đồng/kg	2025-07-23 06:00:30.542
1f48a251-8477-464a-a0f8-3443b0c2a5d7	95500.00	2025-07-23 06:00:34.157807	f108e88c-cb54-4757-b710-b11a21b9015d	Đắk Lắk	+3,200	increase	domestic_coffee	VND	đồng/kg	2025-07-23 06:00:34.155
83665867-ebca-4cf1-9ed9-78355d388f9f	95300.00	2025-07-23 06:00:34.19315	f108e88c-cb54-4757-b710-b11a21b9015d	Lâm Đồng	+3,700	increase	domestic_coffee	VND	đồng/kg	2025-07-23 06:00:34.191
67f1e6d6-e2ac-4d39-8751-0cd9bd982df5	95500.00	2025-07-23 06:00:34.224495	f108e88c-cb54-4757-b710-b11a21b9015d	Gia Lai	+3,300	increase	domestic_coffee	VND	đồng/kg	2025-07-23 06:00:34.222
1f8d6c41-21e2-4bf7-9c92-c50ee8257938	95700.00	2025-07-23 06:00:34.256065	f108e88c-cb54-4757-b710-b11a21b9015d	Đắk Nông	+3,400	increase	domestic_coffee	VND	đồng/kg	2025-07-23 06:00:34.254
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.products (id, name, "createdAt", code, country) FROM stdin;
f108e88c-cb54-4757-b710-b11a21b9015d	Cà phê	2025-07-21 15:20:50.849467	CAFE	Vietnam
\.


--
-- Data for Name: rental_boarding_house; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.rental_boarding_house (id, name, address, "userId", "createdAt", "updatedAt") FROM stdin;
1	Nhà trọ An Nhiên	123 Đường A, Q1, HCM	1	2025-07-23 12:40:07.86303	2025-07-23 12:40:07.86303
\.


--
-- Data for Name: rental_extra_fees; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.rental_extra_fees (id, name, "defaultAmount", type, "createdAt", "updatedAt") FROM stdin;
1	Phí wifi	100000	fixed	2025-07-23 12:40:07.911317	2025-07-23 12:40:07.911317
2	Phí giữ xe	50000	per_person	2025-07-23 12:40:07.916475	2025-07-23 12:40:07.916475
\.


--
-- Data for Name: rental_invoice; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.rental_invoice (id, "rentalLogId", "totalRent", "electricityFee", "waterFee", "extraFee", "totalAmount", status, "createdAt", "updatedAt") FROM stdin;
1	1	2000000	59500	60000	200000	2359500	unpaid	2025-07-23 12:40:07.94385	2025-07-23 12:40:07.94385
2	2	1800000	59500	30000	150000	2329500	paid	2025-07-23 12:40:07.94385	2025-07-23 12:40:07.94385
\.


--
-- Data for Name: rental_log_extras; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.rental_log_extras (id, "rentalLogId", "roomId", "extraFeeId", quantity, amount, "createdAt", "updatedAt") FROM stdin;
1	1	1	1	1	100000	2025-07-23 12:40:07.933738	2025-07-23 12:40:07.933738
2	1	1	2	2	100000	2025-07-23 12:40:07.933738	2025-07-23 12:40:07.933738
3	2	2	1	1	100000	2025-07-23 12:40:07.933738	2025-07-23 12:40:07.933738
4	2	2	2	1	50000	2025-07-23 12:40:07.933738	2025-07-23 12:40:07.933738
\.


--
-- Data for Name: rental_logs; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.rental_logs (id, "roomId", month, year, "rentPrice", "electricityOld", "electricityNew", "waterOld", "waterNew", note, "createdAt", "updatedAt") FROM stdin;
1	1	7	2025	2000000	123	140	20	26	Không có gì	2025-07-23 12:40:07.920754	2025-07-23 12:40:07.920754
2	2	7	2025	1800000	88	105	10	13	Có bạn mới	2025-07-23 12:40:07.927638	2025-07-23 12:40:07.927638
\.


--
-- Data for Name: rental_room; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.rental_room (id, name, "boardingHouseId", area, "basePrice", "createdAt", "updatedAt") FROM stdin;
1	Phòng 101	1	20.50	2000000	2025-07-23 12:40:07.886006	2025-07-23 12:40:07.886006
2	Phòng 102	1	18.00	1800000	2025-07-23 12:40:07.893572	2025-07-23 12:40:07.893572
\.


--
-- Data for Name: rental_room_settings; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.rental_room_settings (id, "roomId", "electricityPrice", "waterPrice", "effectiveFrom", "createdAt", "updatedAt") FROM stdin;
1	1	3500	10000	2025-01-01 00:00:00	2025-07-23 12:40:07.898838	2025-07-23 12:40:07.898838
2	2	4000	12000	2025-01-01 00:00:00	2025-07-23 12:40:07.906313	2025-07-23 12:40:07.906313
\.


--
-- Data for Name: role; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.role (id, name) FROM stdin;
2	User
1	Admin
\.


--
-- Data for Name: session; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.session (id, hash, "createdAt", "updatedAt", "deletedAt", "userId") FROM stdin;
1	49655dd3b0eddfefe315845bdccb8a0e08ee5ce1a2a810947fcea0c6414c284a	2025-07-22 16:43:44.420751	2025-07-22 16:43:44.420751	\N	3
2	a0e19fa05c7ecab599ef7f387cf2e95a499c7aefcbfafbb3276362c20ccb93f1	2025-07-22 16:43:56.341328	2025-07-22 16:43:56.341328	\N	3
3	ec2e81a975f95b6d4aa593c1b02e57f9682ef0087f76fa7bd47cfb86af2c98fa	2025-07-22 16:44:10.586876	2025-07-22 16:44:10.586876	\N	3
4	30280d0e7502198563584d20639a58b9c33e3d329a8418d600d9627ccc071f86	2025-07-22 16:50:01.581482	2025-07-22 16:50:01.581482	\N	3
5	204bd2fd46c45780efa4f65e185bd20e38859b6e4b8730fed033183b3e8abc9c	2025-07-22 16:50:43.771448	2025-07-22 16:50:43.771448	\N	3
6	90c6c1cd052e7fb7899900f3fd9d2e278fcfd269edf2daf16751f92a7f6680a2	2025-07-22 16:51:43.601833	2025-07-22 16:51:43.601833	\N	3
7	1f4aa92871cbecd70860fd1d395e2374f420fa2cd9b52deb2adb775ab201452d	2025-07-22 16:52:58.149268	2025-07-22 16:52:58.149268	\N	3
8	d903b029563316c1dfce22ec4060019dbbfa5f27f393121c947e47e00ad37757	2025-07-22 16:53:17.432838	2025-07-22 16:53:17.432838	\N	3
9	b0403d7eeddf9b5f5c29ef3653370238ed4bf6e517830a77583053bc439061a8	2025-07-22 16:54:53.670313	2025-07-22 16:54:53.670313	\N	3
10	51911b996b37671ab799d4fc700522acf55956c7db46027b53b5fd6fd77b8916	2025-07-22 16:56:19.843494	2025-07-22 16:56:19.843494	\N	3
11	16e081b9a6450d961e51f01094c44edd74df42254a0de240a7a5230fb93a7786	2025-07-22 16:57:36.595519	2025-07-22 16:57:36.595519	\N	3
12	d2c7dd09b8f8b3a4e1ed937e88f221c63481f9e88d11bdd2117921ff2d3bc7e9	2025-07-22 17:10:26.7193	2025-07-22 17:10:26.7193	\N	3
13	cb8ab5697bb012626507af84b18bc9ecdc6ac2910136ebfdc8315a604ce8682f	2025-07-22 17:11:29.492948	2025-07-22 17:11:29.492948	\N	3
14	33a7220bb539c09a7898147d349f42865c6b9a143b47c9eb71eb85823b4a6451	2025-07-22 17:12:00.687467	2025-07-22 17:12:00.687467	\N	3
\.


--
-- Data for Name: status; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.status (id, name) FROM stdin;
1	Active
2	Inactive
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public."user" (id, email, password, provider, "socialId", "firstName", "lastName", "createdAt", "updatedAt", "deletedAt", "photoId", "roleId", "statusId") FROM stdin;
1	admin@example.com	$2b$10$Fol/OxgujHIhTU6VRH9ITeO03S8bx0l5JUxb.DNn3k2sepZyYN6LS	email	\N	Super	Admin	2025-07-21 15:20:50.70643	2025-07-21 15:20:50.70643	\N	\N	1	1
2	john.doe@example.com	$2b$10$Wazg3SDrrW2hyWW3R9O/auH4PPaIeTTJrhUs4WaIcbbiwh.Bzw0.G	email	\N	John	Doe	2025-07-21 15:20:50.835508	2025-07-21 15:20:50.835508	\N	\N	2	1
3	guest@example.com	$2b$10$7sBBHlGt10mbMuPpYGYPq.O8eRD1Lhg/mJkouwxVR3zfDRQD2t7p6	email	\N	guest	guest	2025-07-22 14:47:00.111738	2025-07-22 14:47:00.111738	\N	\N	2	2
\.


--
-- Name: migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.migrations_id_seq', 7, true);


--
-- Name: rental_boarding_house_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.rental_boarding_house_id_seq', 1, true);


--
-- Name: rental_extra_fees_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.rental_extra_fees_id_seq', 2, true);


--
-- Name: rental_invoice_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.rental_invoice_id_seq', 2, true);


--
-- Name: rental_log_extras_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.rental_log_extras_id_seq', 4, true);


--
-- Name: rental_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.rental_logs_id_seq', 2, true);


--
-- Name: rental_room_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.rental_room_id_seq', 2, true);


--
-- Name: rental_room_settings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.rental_room_settings_id_seq', 2, true);


--
-- Name: session_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.session_id_seq', 14, true);


--
-- Name: user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.user_id_seq', 3, true);


--
-- Name: products PK_0806c755e0aca124e67c0cf6d7d; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY (id);


--
-- Name: product_prices PK_31c33ddacf759f7c0e5d327c4bb; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.product_prices
    ADD CONSTRAINT "PK_31c33ddacf759f7c0e5d327c4bb" PRIMARY KEY (id);


--
-- Name: file PK_36b46d232307066b3a2c9ea3a1d; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.file
    ADD CONSTRAINT "PK_36b46d232307066b3a2c9ea3a1d" PRIMARY KEY (id);


--
-- Name: notifications PK_6a72c3c0f683f6462415e653c3a; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY (id);


--
-- Name: follows PK_8988f607744e16ff79da3b8a627; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.follows
    ADD CONSTRAINT "PK_8988f607744e16ff79da3b8a627" PRIMARY KEY (id);


--
-- Name: migrations PK_8c82d7f526340ab734260ea46be; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.migrations
    ADD CONSTRAINT "PK_8c82d7f526340ab734260ea46be" PRIMARY KEY (id);


--
-- Name: devices PK_b1514758245c12daf43486dd1f0; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.devices
    ADD CONSTRAINT "PK_b1514758245c12daf43486dd1f0" PRIMARY KEY (id);


--
-- Name: role PK_b36bcfe02fc8de3c57a8b2391c2; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY (id);


--
-- Name: price_stats PK_b65b2ba2ffafe16f52e8fadb0d9; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.price_stats
    ADD CONSTRAINT "PK_b65b2ba2ffafe16f52e8fadb0d9" PRIMARY KEY (id);


--
-- Name: user PK_cace4a159ff9f2512dd42373760; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY (id);


--
-- Name: status PK_e12743a7086ec826733f54e1d95; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.status
    ADD CONSTRAINT "PK_e12743a7086ec826733f54e1d95" PRIMARY KEY (id);


--
-- Name: session PK_f55da76ac1c3ac420f444d2ff11; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT "PK_f55da76ac1c3ac420f444d2ff11" PRIMARY KEY (id);


--
-- Name: rental_boarding_house PK_rental_boarding_house; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.rental_boarding_house
    ADD CONSTRAINT "PK_rental_boarding_house" PRIMARY KEY (id);


--
-- Name: rental_extra_fees PK_rental_extra_fees; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.rental_extra_fees
    ADD CONSTRAINT "PK_rental_extra_fees" PRIMARY KEY (id);


--
-- Name: rental_invoice PK_rental_invoice; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.rental_invoice
    ADD CONSTRAINT "PK_rental_invoice" PRIMARY KEY (id);


--
-- Name: rental_log_extras PK_rental_log_extras; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.rental_log_extras
    ADD CONSTRAINT "PK_rental_log_extras" PRIMARY KEY (id);


--
-- Name: rental_logs PK_rental_logs; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.rental_logs
    ADD CONSTRAINT "PK_rental_logs" PRIMARY KEY (id);


--
-- Name: rental_room PK_rental_room; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.rental_room
    ADD CONSTRAINT "PK_rental_room" PRIMARY KEY (id);


--
-- Name: rental_room_settings PK_rental_room_settings; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.rental_room_settings
    ADD CONSTRAINT "PK_rental_room_settings" PRIMARY KEY (id);


--
-- Name: user REL_75e2be4ce11d447ef43be0e374; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "REL_75e2be4ce11d447ef43be0e374" UNIQUE ("photoId");


--
-- Name: follows UQ_2555560202955b8ea6c4c63f2db; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.follows
    ADD CONSTRAINT "UQ_2555560202955b8ea6c4c63f2db" UNIQUE ("userId", "productId");


--
-- Name: user UQ_e12875dfb3b1d92d7d7c5377e22; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE (email);


--
-- Name: IDX_2555560202955b8ea6c4c63f2d; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX "IDX_2555560202955b8ea6c4c63f2d" ON public.follows USING btree ("userId", "productId");


--
-- Name: IDX_268deb7d67bea4cdec4ed320df; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX "IDX_268deb7d67bea4cdec4ed320df" ON public.product_prices USING btree ("productId", province, "tableId", "scrapedAt");


--
-- Name: IDX_3d2f174ef04fb312fdebd0ddc5; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX "IDX_3d2f174ef04fb312fdebd0ddc5" ON public.session USING btree ("userId");


--
-- Name: IDX_58e4dbff0e1a32a9bdc861bb29; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX "IDX_58e4dbff0e1a32a9bdc861bb29" ON public."user" USING btree ("firstName");


--
-- Name: IDX_7a12530f6b1d1f165443ee65b5; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX "IDX_7a12530f6b1d1f165443ee65b5" ON public.price_stats USING btree ("productId", province, "tableId", date);


--
-- Name: IDX_9bd2fe7a8e694dedc4ec2f666f; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX "IDX_9bd2fe7a8e694dedc4ec2f666f" ON public."user" USING btree ("socialId");


--
-- Name: IDX_bfb7ea157f84a00a2ca10c5302; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX "IDX_bfb7ea157f84a00a2ca10c5302" ON public.devices USING btree ("userId", "deviceToken");


--
-- Name: IDX_c6acfaeef8415aa43a61c637e6; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX "IDX_c6acfaeef8415aa43a61c637e6" ON public.notifications USING btree ("userId", viewed);


--
-- Name: IDX_ef19dfa50221762de8ce35b043; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX "IDX_ef19dfa50221762de8ce35b043" ON public.notifications USING btree ("userId", type);


--
-- Name: IDX_f0e1b4ecdca13b177e2e3a0613; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX "IDX_f0e1b4ecdca13b177e2e3a0613" ON public."user" USING btree ("lastName");


--
-- Name: product_prices FK_08b505f0f33710eb52a6f34ada4; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.product_prices
    ADD CONSTRAINT "FK_08b505f0f33710eb52a6f34ada4" FOREIGN KEY ("productId") REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: session FK_3d2f174ef04fb312fdebd0ddc53; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT "FK_3d2f174ef04fb312fdebd0ddc53" FOREIGN KEY ("userId") REFERENCES public."user"(id);


--
-- Name: notifications FK_692a909ee0fa9383e7859f9b406; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT "FK_692a909ee0fa9383e7859f9b406" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- Name: user FK_75e2be4ce11d447ef43be0e374f; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "FK_75e2be4ce11d447ef43be0e374f" FOREIGN KEY ("photoId") REFERENCES public.file(id);


--
-- Name: follows FK_83a0137279e8acc0c60822d0bb1; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.follows
    ADD CONSTRAINT "FK_83a0137279e8acc0c60822d0bb1" FOREIGN KEY ("productId") REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: user FK_c28e52f758e7bbc53828db92194; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "FK_c28e52f758e7bbc53828db92194" FOREIGN KEY ("roleId") REFERENCES public.role(id);


--
-- Name: user FK_dc18daa696860586ba4667a9d31; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "FK_dc18daa696860586ba4667a9d31" FOREIGN KEY ("statusId") REFERENCES public.status(id);


--
-- Name: price_stats FK_dc219309dcdb42b1c1bde0ffe66; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.price_stats
    ADD CONSTRAINT "FK_dc219309dcdb42b1c1bde0ffe66" FOREIGN KEY ("productId") REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: devices FK_e8a5d59f0ac3040395f159507c6; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.devices
    ADD CONSTRAINT "FK_e8a5d59f0ac3040395f159507c6" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- Name: follows FK_eeb492da6894abf2e0acceb53f2; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.follows
    ADD CONSTRAINT "FK_eeb492da6894abf2e0acceb53f2" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- Name: rental_boarding_house FK_rental_boarding_house_user; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.rental_boarding_house
    ADD CONSTRAINT "FK_rental_boarding_house_user" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- Name: rental_invoice FK_rental_invoice_rental_log; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.rental_invoice
    ADD CONSTRAINT "FK_rental_invoice_rental_log" FOREIGN KEY ("rentalLogId") REFERENCES public.rental_logs(id) ON DELETE CASCADE;


--
-- Name: rental_log_extras FK_rental_log_extras_extra_fee; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.rental_log_extras
    ADD CONSTRAINT "FK_rental_log_extras_extra_fee" FOREIGN KEY ("extraFeeId") REFERENCES public.rental_extra_fees(id) ON DELETE CASCADE;


--
-- Name: rental_log_extras FK_rental_log_extras_rental_log; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.rental_log_extras
    ADD CONSTRAINT "FK_rental_log_extras_rental_log" FOREIGN KEY ("rentalLogId") REFERENCES public.rental_logs(id) ON DELETE CASCADE;


--
-- Name: rental_log_extras FK_rental_log_extras_room; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.rental_log_extras
    ADD CONSTRAINT "FK_rental_log_extras_room" FOREIGN KEY ("roomId") REFERENCES public.rental_room(id) ON DELETE CASCADE;


--
-- Name: rental_logs FK_rental_logs_room; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.rental_logs
    ADD CONSTRAINT "FK_rental_logs_room" FOREIGN KEY ("roomId") REFERENCES public.rental_room(id) ON DELETE CASCADE;


--
-- Name: rental_room FK_rental_room_boarding_house; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.rental_room
    ADD CONSTRAINT "FK_rental_room_boarding_house" FOREIGN KEY ("boardingHouseId") REFERENCES public.rental_boarding_house(id) ON DELETE CASCADE;


--
-- Name: rental_room_settings FK_rental_room_settings_room; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.rental_room_settings
    ADD CONSTRAINT "FK_rental_room_settings_room" FOREIGN KEY ("roomId") REFERENCES public.rental_room(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

