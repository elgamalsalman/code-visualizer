--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5 (Postgres.app)
-- Dumped by pg_dump version 17.5 (Postgres.app)

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: users; Type: TABLE; Schema: public; Owner: elgamalsalman
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying(50) NOT NULL,
    name character varying(50) NOT NULL,
    password_hash character(64) NOT NULL,
    creation_timestamp timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    verified boolean DEFAULT false NOT NULL,
    authentication_key character(64) NOT NULL,
    CONSTRAINT email_format CHECK (((email)::text ~~ '%@%'::text))
);


ALTER TABLE public.users OWNER TO elgamalsalman;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: elgamalsalman
--

ALTER TABLE public.users ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: users unique_email; Type: CONSTRAINT; Schema: public; Owner: elgamalsalman
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT unique_email UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: elgamalsalman
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

