--
-- PostgreSQL database dump
--

-- Dumped from database version 14.10 (Debian 14.10-1.pgdg120+1)
-- Dumped by pg_dump version 14.10 (Debian 14.10-1.pgdg120+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
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
-- Name: comment; Type: TABLE; Schema: public; Owner: moti
--

CREATE TABLE public.comment (
    id integer NOT NULL,
    content text NOT NULL,
    "authorId" integer,
    "postId" integer
);


ALTER TABLE public.comment OWNER TO moti;

--
-- Name: comment_id_seq; Type: SEQUENCE; Schema: public; Owner: moti
--

CREATE SEQUENCE public.comment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.comment_id_seq OWNER TO moti;

--
-- Name: comment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: moti
--

ALTER SEQUENCE public.comment_id_seq OWNED BY public.comment.id;


--
-- Name: file; Type: TABLE; Schema: public; Owner: moti
--

CREATE TABLE public.file (
    id integer NOT NULL,
    filename character varying NOT NULL,
    path character varying NOT NULL,
    "postId" integer
);


ALTER TABLE public.file OWNER TO moti;

--
-- Name: file_id_seq; Type: SEQUENCE; Schema: public; Owner: moti
--

CREATE SEQUENCE public.file_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.file_id_seq OWNER TO moti;

--
-- Name: file_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: moti
--

ALTER SEQUENCE public.file_id_seq OWNED BY public.file.id;


--
-- Name: like; Type: TABLE; Schema: public; Owner: moti
--

CREATE TABLE public."like" (
    id integer NOT NULL,
    "userId" integer,
    "postId" integer,
    "commentId" integer
);


ALTER TABLE public."like" OWNER TO moti;

--
-- Name: like_id_seq; Type: SEQUENCE; Schema: public; Owner: moti
--

CREATE SEQUENCE public.like_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.like_id_seq OWNER TO moti;

--
-- Name: like_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: moti
--

ALTER SEQUENCE public.like_id_seq OWNED BY public."like".id;


--
-- Name: post; Type: TABLE; Schema: public; Owner: moti
--

CREATE TABLE public.post (
    id integer NOT NULL,
    title character varying(500) NOT NULL,
    content text NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "authorId" integer
);


ALTER TABLE public.post OWNER TO moti;

--
-- Name: post_id_seq; Type: SEQUENCE; Schema: public; Owner: moti
--

CREATE SEQUENCE public.post_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.post_id_seq OWNER TO moti;

--
-- Name: post_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: moti
--

ALTER SEQUENCE public.post_id_seq OWNED BY public.post.id;


--
-- Name: user; Type: TABLE; Schema: public; Owner: moti
--

CREATE TABLE public."user" (
    id integer NOT NULL,
    email character varying NOT NULL,
    password character varying NOT NULL,
    nickname character varying NOT NULL
);


ALTER TABLE public."user" OWNER TO moti;

--
-- Name: user_id_seq; Type: SEQUENCE; Schema: public; Owner: moti
--

CREATE SEQUENCE public.user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_id_seq OWNER TO moti;

--
-- Name: user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: moti
--

ALTER SEQUENCE public.user_id_seq OWNED BY public."user".id;


--
-- Name: comment id; Type: DEFAULT; Schema: public; Owner: moti
--

ALTER TABLE ONLY public.comment ALTER COLUMN id SET DEFAULT nextval('public.comment_id_seq'::regclass);


--
-- Name: file id; Type: DEFAULT; Schema: public; Owner: moti
--

ALTER TABLE ONLY public.file ALTER COLUMN id SET DEFAULT nextval('public.file_id_seq'::regclass);


--
-- Name: like id; Type: DEFAULT; Schema: public; Owner: moti
--

ALTER TABLE ONLY public."like" ALTER COLUMN id SET DEFAULT nextval('public.like_id_seq'::regclass);


--
-- Name: post id; Type: DEFAULT; Schema: public; Owner: moti
--

ALTER TABLE ONLY public.post ALTER COLUMN id SET DEFAULT nextval('public.post_id_seq'::regclass);


--
-- Name: user id; Type: DEFAULT; Schema: public; Owner: moti
--

ALTER TABLE ONLY public."user" ALTER COLUMN id SET DEFAULT nextval('public.user_id_seq'::regclass);


--
-- Data for Name: comment; Type: TABLE DATA; Schema: public; Owner: moti
--

COPY public.comment (id, content, "authorId", "postId") FROM stdin;
1	댓글	1	1
2	댓글 작성 중	1	1
3	댓글	1	2
4	댓글 수정함	1	2
5	나도 댓글 담	2	2
6	댓글 달거임	2	2
7	이스터에그	2	6
8	Docker 올리기 힘들었습니다..	1	9
9	멋있네요!!	4	13
\.


--
-- Data for Name: file; Type: TABLE DATA; Schema: public; Owner: moti
--

COPY public.file (id, filename, path, "postId") FROM stdin;
3	file-1702581933517-938634739.jpeg	uploads/file-1702581933517-938634739.jpeg	13
4	file-1702581933517-408904928.jpeg	uploads/file-1702581933517-408904928.jpeg	13
\.


--
-- Data for Name: like; Type: TABLE DATA; Schema: public; Owner: moti
--

COPY public."like" (id, "userId", "postId", "commentId") FROM stdin;
\.


--
-- Data for Name: post; Type: TABLE DATA; Schema: public; Owner: moti
--

COPY public.post (id, title, content, "createdAt", "updatedAt", "authorId") FROM stdin;
1	qwer	qwerqwerqwer	2023-12-15 04:15:52.504704	2023-12-15 04:15:52.504704	1
2	사진 첨부 테스트 수정	사진 첨부 테스트 수정	2023-12-15 04:18:24.944176	2023-12-15 04:18:40.229707	1
3	페이지네이션을 위한 글 1	페이지네이션을 위한 글 1	2023-12-15 04:20:12.49384	2023-12-15 04:20:12.49384	2
4	페이지네이션을 위한 글 2	페이지네이션을 위한 글 2	2023-12-15 04:20:18.923752	2023-12-15 04:20:18.923752	2
5	페이지네이션을 위한 글 3	페이지네이션을 위한 글 3	2023-12-15 04:20:24.173985	2023-12-15 04:20:24.173985	2
6	페이지네이션을 위한 글 4	페이지네이션을 위한 글 4	2023-12-15 04:20:30.675997	2023-12-15 04:20:30.675997	2
7	교수님	교수님	2023-12-15 04:23:09.760029	2023-12-15 04:23:09.760029	1
8	그 동안	그 동안	2023-12-15 04:23:16.774294	2023-12-15 04:23:16.774294	1
9	고생하셨습니다!	고생하셨습니다!	2023-12-15 04:23:24.935214	2023-12-15 04:23:24.935214	1
10	페이지네이션 기능	페이지네이션 기능	2023-12-15 04:23:57.183322	2023-12-15 04:23:57.183322	1
11	정렬 기능	정렬 기능	2023-12-15 04:24:04.039851	2023-12-15 04:24:04.039851	1
12	글 CRUD	글 CRUD 수정 테스트	2023-12-15 04:24:15.057742	2023-12-15 04:24:21.389105	1
13	파일 업로드를 한번 해볼까요?	좋습니다!	2023-12-15 04:25:33.563913	2023-12-15 04:25:33.563913	1
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: moti
--

COPY public."user" (id, email, password, nickname) FROM stdin;
1	jit_wd@gmail.com	$2b$10$SflnAMCcGX2p.baHF3ZhzO3K45OYnSTBaZy7.w79Z8v6h3oq9zVI6	jit_wd
2	moti@gmail.com	$2b$10$iElvfrqosJ3nkkGe0AkB7elhw7/D9NvVfpkuxO.Y8idp/u4wb0q/W	moti
4	algorithm@gmail.com	$2b$10$TkY2a4LhdJo8s1s4nAaA0OpELbZhfzsZdVGisA6AtxkcQVB3t25Zm	algo
\.


--
-- Name: comment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: moti
--

SELECT pg_catalog.setval('public.comment_id_seq', 9, true);


--
-- Name: file_id_seq; Type: SEQUENCE SET; Schema: public; Owner: moti
--

SELECT pg_catalog.setval('public.file_id_seq', 4, true);


--
-- Name: like_id_seq; Type: SEQUENCE SET; Schema: public; Owner: moti
--

SELECT pg_catalog.setval('public.like_id_seq', 1, false);


--
-- Name: post_id_seq; Type: SEQUENCE SET; Schema: public; Owner: moti
--

SELECT pg_catalog.setval('public.post_id_seq', 13, true);


--
-- Name: user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: moti
--

SELECT pg_catalog.setval('public.user_id_seq', 4, true);


--
-- Name: comment PK_0b0e4bbc8415ec426f87f3a88e2; Type: CONSTRAINT; Schema: public; Owner: moti
--

ALTER TABLE ONLY public.comment
    ADD CONSTRAINT "PK_0b0e4bbc8415ec426f87f3a88e2" PRIMARY KEY (id);


--
-- Name: file PK_36b46d232307066b3a2c9ea3a1d; Type: CONSTRAINT; Schema: public; Owner: moti
--

ALTER TABLE ONLY public.file
    ADD CONSTRAINT "PK_36b46d232307066b3a2c9ea3a1d" PRIMARY KEY (id);


--
-- Name: post PK_be5fda3aac270b134ff9c21cdee; Type: CONSTRAINT; Schema: public; Owner: moti
--

ALTER TABLE ONLY public.post
    ADD CONSTRAINT "PK_be5fda3aac270b134ff9c21cdee" PRIMARY KEY (id);


--
-- Name: user PK_cace4a159ff9f2512dd42373760; Type: CONSTRAINT; Schema: public; Owner: moti
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY (id);


--
-- Name: like PK_eff3e46d24d416b52a7e0ae4159; Type: CONSTRAINT; Schema: public; Owner: moti
--

ALTER TABLE ONLY public."like"
    ADD CONSTRAINT "PK_eff3e46d24d416b52a7e0ae4159" PRIMARY KEY (id);


--
-- Name: user UQ_e12875dfb3b1d92d7d7c5377e22; Type: CONSTRAINT; Schema: public; Owner: moti
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE (email);


--
-- Name: comment FK_276779da446413a0d79598d4fbd; Type: FK CONSTRAINT; Schema: public; Owner: moti
--

ALTER TABLE ONLY public.comment
    ADD CONSTRAINT "FK_276779da446413a0d79598d4fbd" FOREIGN KEY ("authorId") REFERENCES public."user"(id);


--
-- Name: like FK_3acf7c55c319c4000e8056c1279; Type: FK CONSTRAINT; Schema: public; Owner: moti
--

ALTER TABLE ONLY public."like"
    ADD CONSTRAINT "FK_3acf7c55c319c4000e8056c1279" FOREIGN KEY ("postId") REFERENCES public.post(id);


--
-- Name: comment FK_94a85bb16d24033a2afdd5df060; Type: FK CONSTRAINT; Schema: public; Owner: moti
--

ALTER TABLE ONLY public.comment
    ADD CONSTRAINT "FK_94a85bb16d24033a2afdd5df060" FOREIGN KEY ("postId") REFERENCES public.post(id);


--
-- Name: post FK_c6fb082a3114f35d0cc27c518e0; Type: FK CONSTRAINT; Schema: public; Owner: moti
--

ALTER TABLE ONLY public.post
    ADD CONSTRAINT "FK_c6fb082a3114f35d0cc27c518e0" FOREIGN KEY ("authorId") REFERENCES public."user"(id);


--
-- Name: like FK_d86e0a3eeecc21faa0da415a18a; Type: FK CONSTRAINT; Schema: public; Owner: moti
--

ALTER TABLE ONLY public."like"
    ADD CONSTRAINT "FK_d86e0a3eeecc21faa0da415a18a" FOREIGN KEY ("commentId") REFERENCES public.comment(id);


--
-- Name: like FK_e8fb739f08d47955a39850fac23; Type: FK CONSTRAINT; Schema: public; Owner: moti
--

ALTER TABLE ONLY public."like"
    ADD CONSTRAINT "FK_e8fb739f08d47955a39850fac23" FOREIGN KEY ("userId") REFERENCES public."user"(id);


--
-- Name: file FK_f0f2188b3e254ad31ba2b95ec4b; Type: FK CONSTRAINT; Schema: public; Owner: moti
--

ALTER TABLE ONLY public.file
    ADD CONSTRAINT "FK_f0f2188b3e254ad31ba2b95ec4b" FOREIGN KEY ("postId") REFERENCES public.post(id);


--
-- PostgreSQL database dump complete
--

