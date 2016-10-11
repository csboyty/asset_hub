--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: alembic_version; Type: TABLE; Schema: public; Owner: dbuser; Tablespace: 
--

CREATE TABLE alembic_version (
    version_num character varying(32) NOT NULL
);


ALTER TABLE alembic_version OWNER TO dbuser;

--
-- Name: artifact_assets; Type: TABLE; Schema: public; Owner: dbuser; Tablespace: 
--

CREATE TABLE artifact_assets (
    created timestamp without time zone NOT NULL,
    updated timestamp without time zone NOT NULL,
    id integer NOT NULL,
    artifact_id integer NOT NULL,
    media_file character varying(256) NOT NULL,
    media_filename character varying(64) NOT NULL
);


ALTER TABLE artifact_assets OWNER TO dbuser;

--
-- Name: artifact_assets_id_seq; Type: SEQUENCE; Schema: public; Owner: dbuser
--

CREATE SEQUENCE artifact_assets_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE artifact_assets_id_seq OWNER TO dbuser;

--
-- Name: artifact_assets_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dbuser
--

ALTER SEQUENCE artifact_assets_id_seq OWNED BY artifact_assets.id;


--
-- Name: artifact_keyword_tag; Type: TABLE; Schema: public; Owner: dbuser; Tablespace: 
--

CREATE TABLE artifact_keyword_tag (
    artifact_id integer NOT NULL,
    tag_id integer NOT NULL
);


ALTER TABLE artifact_keyword_tag OWNER TO dbuser;

--
-- Name: artifact_material_tag; Type: TABLE; Schema: public; Owner: dbuser; Tablespace: 
--

CREATE TABLE artifact_material_tag (
    artifact_id integer NOT NULL,
    tag_id integer NOT NULL
);


ALTER TABLE artifact_material_tag OWNER TO dbuser;

--
-- Name: artifact_theme_tag; Type: TABLE; Schema: public; Owner: dbuser; Tablespace: 
--

CREATE TABLE artifact_theme_tag (
    artifact_id integer NOT NULL,
    tag_id integer NOT NULL
);


ALTER TABLE artifact_theme_tag OWNER TO dbuser;

--
-- Name: artifacts; Type: TABLE; Schema: public; Owner: dbuser; Tablespace: 
--

CREATE TABLE artifacts (
    deleted boolean NOT NULL,
    created timestamp without time zone NOT NULL,
    updated timestamp without time zone NOT NULL,
    id integer NOT NULL,
    name character varying(64) NOT NULL,
    author_txt character varying(64) NOT NULL,
    size_txt character varying(128) NOT NULL,
    illustration text NOT NULL,
    analysis text NOT NULL,
    preview_image character varying(256) NOT NULL,
    attachment_file character varying(256) NOT NULL,
    attachment_filename character varying(64) NOT NULL,
    user_id integer
);


ALTER TABLE artifacts OWNER TO dbuser;

--
-- Name: artifacts_id_seq; Type: SEQUENCE; Schema: public; Owner: dbuser
--

CREATE SEQUENCE artifacts_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE artifacts_id_seq OWNER TO dbuser;

--
-- Name: artifacts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dbuser
--

ALTER SEQUENCE artifacts_id_seq OWNED BY artifacts.id;


--
-- Name: tags; Type: TABLE; Schema: public; Owner: dbuser; Tablespace: 
--

CREATE TABLE tags (
    id integer NOT NULL,
    name character varying(32) NOT NULL,
    category character varying(16) NOT NULL
);


ALTER TABLE tags OWNER TO dbuser;

--
-- Name: tags_id_seq; Type: SEQUENCE; Schema: public; Owner: dbuser
--

CREATE SEQUENCE tags_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE tags_id_seq OWNER TO dbuser;

--
-- Name: tags_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dbuser
--

ALTER SEQUENCE tags_id_seq OWNED BY tags.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: dbuser; Tablespace: 
--

CREATE TABLE users (
    created timestamp without time zone NOT NULL,
    updated timestamp without time zone NOT NULL,
    id integer NOT NULL,
    email character varying(128) NOT NULL,
    fullname character varying(32),
    tel character varying(20),
    password character varying(128),
    active boolean,
    role character varying(16)
);


ALTER TABLE users OWNER TO dbuser;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: dbuser
--

CREATE SEQUENCE users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE users_id_seq OWNER TO dbuser;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dbuser
--

ALTER SEQUENCE users_id_seq OWNED BY users.id;


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: dbuser
--

ALTER TABLE ONLY artifact_assets ALTER COLUMN id SET DEFAULT nextval('artifact_assets_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: dbuser
--

ALTER TABLE ONLY artifacts ALTER COLUMN id SET DEFAULT nextval('artifacts_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: dbuser
--

ALTER TABLE ONLY tags ALTER COLUMN id SET DEFAULT nextval('tags_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: dbuser
--

ALTER TABLE ONLY users ALTER COLUMN id SET DEFAULT nextval('users_id_seq'::regclass);


--
-- Name: artifact_assets_pkey; Type: CONSTRAINT; Schema: public; Owner: dbuser; Tablespace: 
--

ALTER TABLE ONLY artifact_assets
    ADD CONSTRAINT artifact_assets_pkey PRIMARY KEY (id);


--
-- Name: artifact_keyword_tag_pkey; Type: CONSTRAINT; Schema: public; Owner: dbuser; Tablespace: 
--

ALTER TABLE ONLY artifact_keyword_tag
    ADD CONSTRAINT artifact_keyword_tag_pkey PRIMARY KEY (artifact_id, tag_id);


--
-- Name: artifact_material_tag_pkey; Type: CONSTRAINT; Schema: public; Owner: dbuser; Tablespace: 
--

ALTER TABLE ONLY artifact_material_tag
    ADD CONSTRAINT artifact_material_tag_pkey PRIMARY KEY (artifact_id, tag_id);


--
-- Name: artifact_theme_tag_pkey; Type: CONSTRAINT; Schema: public; Owner: dbuser; Tablespace: 
--

ALTER TABLE ONLY artifact_theme_tag
    ADD CONSTRAINT artifact_theme_tag_pkey PRIMARY KEY (artifact_id, tag_id);


--
-- Name: artifacts_pkey; Type: CONSTRAINT; Schema: public; Owner: dbuser; Tablespace: 
--

ALTER TABLE ONLY artifacts
    ADD CONSTRAINT artifacts_pkey PRIMARY KEY (id);


--
-- Name: tag_name_category_uk; Type: CONSTRAINT; Schema: public; Owner: dbuser; Tablespace: 
--

ALTER TABLE ONLY tags
    ADD CONSTRAINT tag_name_category_uk UNIQUE (name, category);


--
-- Name: tags_pkey; Type: CONSTRAINT; Schema: public; Owner: dbuser; Tablespace: 
--

ALTER TABLE ONLY tags
    ADD CONSTRAINT tags_pkey PRIMARY KEY (id);


--
-- Name: users_email_key; Type: CONSTRAINT; Schema: public; Owner: dbuser; Tablespace: 
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users_pkey; Type: CONSTRAINT; Schema: public; Owner: dbuser; Tablespace: 
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: artifact_assets_artifact_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dbuser
--

ALTER TABLE ONLY artifact_assets
    ADD CONSTRAINT artifact_assets_artifact_id_fkey FOREIGN KEY (artifact_id) REFERENCES artifacts(id) ON DELETE CASCADE;


--
-- Name: artifact_keyword_tag_artifact_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dbuser
--

ALTER TABLE ONLY artifact_keyword_tag
    ADD CONSTRAINT artifact_keyword_tag_artifact_id_fkey FOREIGN KEY (artifact_id) REFERENCES artifacts(id) ON DELETE CASCADE;


--
-- Name: artifact_keyword_tag_tag_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dbuser
--

ALTER TABLE ONLY artifact_keyword_tag
    ADD CONSTRAINT artifact_keyword_tag_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE;


--
-- Name: artifact_material_tag_artifact_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dbuser
--

ALTER TABLE ONLY artifact_material_tag
    ADD CONSTRAINT artifact_material_tag_artifact_id_fkey FOREIGN KEY (artifact_id) REFERENCES artifacts(id) ON DELETE CASCADE;


--
-- Name: artifact_material_tag_tag_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dbuser
--

ALTER TABLE ONLY artifact_material_tag
    ADD CONSTRAINT artifact_material_tag_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE;


--
-- Name: artifact_theme_tag_artifact_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dbuser
--

ALTER TABLE ONLY artifact_theme_tag
    ADD CONSTRAINT artifact_theme_tag_artifact_id_fkey FOREIGN KEY (artifact_id) REFERENCES artifacts(id) ON DELETE CASCADE;


--
-- Name: artifact_theme_tag_tag_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dbuser
--

ALTER TABLE ONLY artifact_theme_tag
    ADD CONSTRAINT artifact_theme_tag_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE;


--
-- Name: artifacts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dbuser
--

ALTER TABLE ONLY artifacts
    ADD CONSTRAINT artifacts_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id);


--
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

