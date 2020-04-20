--
-- PostgreSQL database dump
--

-- Dumped from database version 11.7 (Ubuntu 11.7-0ubuntu0.19.10.1)
-- Dumped by pg_dump version 11.7 (Ubuntu 11.7-0ubuntu0.19.10.1)

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

SET default_with_oids = false;

--
-- Name: chefs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.chefs (
    id integer NOT NULL,
    name text NOT NULL,
    created_at timestamp without time zone NOT NULL,
    file_id integer
);


--
-- Name: chefs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.chefs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: chefs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.chefs_id_seq OWNED BY public.chefs.id;


--
-- Name: files; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.files (
    id integer NOT NULL,
    name text NOT NULL,
    path text NOT NULL
);


--
-- Name: files_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.files_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: files_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.files_id_seq OWNED BY public.files.id;


--
-- Name: recipe_files; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.recipe_files (
    id integer NOT NULL,
    recipe_id integer NOT NULL,
    file_id integer NOT NULL
);


--
-- Name: recipe_files_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.recipe_files_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: recipe_files_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.recipe_files_id_seq OWNED BY public.recipe_files.id;


--
-- Name: recipes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.recipes (
    id integer NOT NULL,
    chef_id integer NOT NULL,
    title text NOT NULL,
    ingredients text[] NOT NULL,
    preparation text[] NOT NULL,
    information text,
    created_at timestamp without time zone NOT NULL
);


--
-- Name: recipes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.recipes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: recipes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.recipes_id_seq OWNED BY public.recipes.id;


--
-- Name: chefs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chefs ALTER COLUMN id SET DEFAULT nextval('public.chefs_id_seq'::regclass);


--
-- Name: files id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.files ALTER COLUMN id SET DEFAULT nextval('public.files_id_seq'::regclass);


--
-- Name: recipe_files id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recipe_files ALTER COLUMN id SET DEFAULT nextval('public.recipe_files_id_seq'::regclass);


--
-- Name: recipes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recipes ALTER COLUMN id SET DEFAULT nextval('public.recipes_id_seq'::regclass);


--
-- Data for Name: chefs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.chefs (id, name, created_at, file_id) FROM stdin;
1	Jorge Relato	2020-04-13 00:00:00	\N
2	Juliano Vieira	2020-04-13 00:00:00	\N
3	Ricardo Golvea	2020-04-13 00:00:00	\N
4	Fabiana Melo	2020-04-13 00:00:00	\N
6	Júlia Kinoto	2020-04-13 00:00:00	\N
5	Vania Steroski	2020-04-13 00:00:00	\N
7	teste	2020-04-16 00:00:00	\N
\.


--
-- Data for Name: files; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.files (id, name, path) FROM stdin;
1	1587063629550-asinhas.png	public/images/1587063629550-asinhas.png
2	1587063629574-doce.png	public/images/1587063629574-doce.png
3	1587063629576-espaguete.png	public/images/1587063629576-espaguete.png
4	1587063629558-burger.png	public/images/1587063629558-burger.png
5	1587063629579-lasanha.png	public/images/1587063629579-lasanha.png
\.


--
-- Data for Name: recipe_files; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.recipe_files (id, recipe_id, file_id) FROM stdin;
1	7	1
2	7	4
3	7	2
4	7	3
5	7	5
\.


--
-- Data for Name: recipes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.recipes (id, chef_id, title, ingredients, preparation, information, created_at) FROM stdin;
1	1	Triplo bacon burger	{"3 kg de carne moída (escolha uma carne magra e macia)","300 g de bacon moído","1 ovo","3 colheres (sopa) de farinha de trigo","3 colheres (sopa) de tempero caseiro: feito com alho, sal, cebola, pimenta e cheiro verde processados no liquidificador","30 ml de água gelada"}	{"Misture todos os ingredientes muito bem e amasse para que fique tudo muito bem misturado.Misture todos os ingredientes muito bem e amasse para que fique tudo muito bem misturado.","Faça porções de 90 g a 100 g.","Forre um plástico molhado em uma bancada e modele os hambúrgueres utilizando um aro como base.","Faça um de cada vez e retire o aro logo em seguida.","Forre uma assadeira de metal com plástico, coloque os hambúrgueres e intercale camadas de carne e plásticos (sem apertar).","Faça no máximo 4 camadas por forma e leve para congelar.","Retire do congelador, frite ou asse e está pronto."}	Preaqueça a chapa, frigideira ou grelha por 10 minutos antes de levar os hambúrgueres. Adicione um pouquinho de óleo ou manteiga e não amasse os hambúrgueres!\r\nVocê sabia que a receita que precede o hambúrguer surgiu no século XIII, na Europa? A ideia de moer a carne chegou em Hamburgo no século XVII, onde um açogueiro resolveu também temperá-la. Assim, a receita foi disseminada nos Estados Unidos por alemães da região. Lá surgiu a ideia de colocar o hambúrguer no meio do pão e adicionar outros ingredientes, como queijom tomates e alface.	2020-04-13 00:00:00
2	4	Pizza 4 estações	{"1 xícara (chá) de leite","1 ovo","1 colher (chá) de sal","1 colher (chá) de açúcar","1 colher (sopa) de margarina","1 e 1/2 xícara (chá) de farinha de trigo","1 colher (sobremesa) de fermento em pó","1/2 lata de molho de tomate","250 g de mussarela ralada grossa","2 tomates fatiados","azeitona picada","orégano a gosto"}	{"No liquidificador bata o leite, o ovo, o sal, o açúcar, a margarina, a farinha de trigo e o fermento em pó até que tudo esteja encorporado.No liquidificador bata o leite, o ovo, o sal, o açúcar, a margarina, a farinha de trigo e o fermento em pó até que tudo esteja encorporado.","Despeje a massa em uma assadeira para pizza untada com margarina e leve ao forno preaquecido por 20 minutos.","Retire do forno e despeje o molho de tomate.","Cubra a massa com mussarela ralada, tomate e orégano a gosto.","Leve novamente ao forno até derreter a mussarela."}	Pizza de liquidificador é uma receita deliciosa e supersimples de preparar. Feita toda no liquidificador, ela é bem prática para o dia a dia. Aqui no TudoGostoso você também encontra diversas delícias práticas feitas no liquidificador: massa de panqueca, torta de frango de liquidificador, pão de queijo de liquidificador, bolo de banana, bolo de chocolate e muito mais!	2020-04-13 00:00:00
4	2	Lasanha mac n' cheese	{"massa pronta de lasanha","400 g de presunto","400 g de mussarela ralada","2 copos de requeijão","150 g de mussarela para gratinar"}	{"Em uma panela, coloque a manteiga para derreter.","Acrescente a farinha de trigo e misture bem com auxílio de um fouet.","Adicione o leite e misture até formar um creme homogêneo.","Tempere com sal, pimenta e noz-moscada a gosto.","Desligue o fogo e acrescente o creme de leite; misture bem e reserve."}	Recheie a lasanha com o que preferir.	2020-04-13 00:00:00
5	1	Espaguete ao alho	{"1 pacote de macarrão 500 g (tipo do macarrão a gosto)","1 saquinho de alho granulado","1/2 tablete de manteiga (não use margarina)","1 colher (sopa) de azeite extra virgem","ervas (manjericão, orégano, salsa, cebolinha, tomilho, a gosto)",sal,"1 dente de alho","gengibre em pó a gosto","1 folha de louro"}	{"Quando faltar mais ou menos 5 minutos para ficar no ponto de escorrer o macarrão, comece o preparo da receita.","Na frigideira quente coloque a manteiga, o azeite, a folha de louro, e o alho granulado.","Nesta hora um pouco de agilidade, pois o macarrão escorrido vai para a frigideira, sendo mexido e dosado com sal a gosto, as ervas, o gengibre em pó a gosto também.","O dente de alho, serve para você untar os pratos onde serão servidos o macarrão.","Coloque as porções nos pratos já com o cheiro do alho, e enfeite com algumas ervas."}	Não lave o macarrão nem passe óleo ou gordura nele depois de escorrê-lo. Coloque direto na frigideira.	2020-04-13 00:00:00
6	3	Docinhos pão-do-céu	{"1 kg de batata - doce","100 g de manteiga","3 ovos","1 pacote de coco seco ralado (100 g)","3 colheres (sopa) de açúcar","1 lata de Leite Moça","1 colher (sopa) de fermento em pó","manteiga para untar","açúcar de confeiteiro"}	{"Cozinhe a batata-doce numa panela de pressão, com meio litro de água, por cerca de 20 minutos. Descasque e passe pelo espremedor, ainda quente.","Junte a manteiga,os ovos, o coco ralado,o açúcar, o Leite Moça e o fermento em pó, mexendo bem após cada adição.","Despeje em assadeira retangular média, untada e leve ao forno médio (180°C), por aproximadamente 45 minutos.","Depois de frio, polvilhe, com o açúcar de confeiteiro e corte em quadrados."}		2020-04-13 00:00:00
3	5	Asinhas de frango ao barbecue	{"12 encontros de asinha de galinha, temperados a gosto","2 colheres de sopa de farinha de trigo","1/2 xícara (chá) de óleo","1 xícara de molho barbecue","Salada (opcional)"}	{"Em uma tigela coloque o encontro de asinha de galinha e polvilhe a farinha de trigo e misture com as mãos.","Em uma frigideira ou assador coloque o óleo quando estiver quente frite até ficarem douradas.","Para servir fica bonito com salada, ou abuse da criatividade."}		2020-04-13 00:00:00
7	1	teste	{teste}	{teste}	teste teste 123	2020-04-16 00:00:00
\.


--
-- Name: chefs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.chefs_id_seq', 7, true);


--
-- Name: files_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.files_id_seq', 5, true);


--
-- Name: recipe_files_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.recipe_files_id_seq', 5, true);


--
-- Name: recipes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.recipes_id_seq', 7, true);


--
-- Name: chefs chefs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chefs
    ADD CONSTRAINT chefs_pkey PRIMARY KEY (id);


--
-- Name: files files_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.files
    ADD CONSTRAINT files_pkey PRIMARY KEY (id);


--
-- Name: recipe_files recipe_files_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recipe_files
    ADD CONSTRAINT recipe_files_pkey PRIMARY KEY (id);


--
-- Name: recipes recipes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recipes
    ADD CONSTRAINT recipes_pkey PRIMARY KEY (id);


--
-- Name: chefs chefs_files_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chefs
    ADD CONSTRAINT chefs_files_id_fkey FOREIGN KEY (file_id) REFERENCES public.files(id);


--
-- Name: recipe_files recipe_files_file_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recipe_files
    ADD CONSTRAINT recipe_files_file_id_fkey FOREIGN KEY (file_id) REFERENCES public.files(id);


--
-- Name: recipe_files recipe_files_recipe_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recipe_files
    ADD CONSTRAINT recipe_files_recipe_id_fkey FOREIGN KEY (recipe_id) REFERENCES public.recipes(id);


--
-- Name: recipes recipes_chef_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recipes
    ADD CONSTRAINT recipes_chef_id_fkey FOREIGN KEY (chef_id) REFERENCES public.chefs(id);


--
-- PostgreSQL database dump complete
--

