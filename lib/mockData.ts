export interface Movie {
  id: string;
  title: string;
  year: number;
  rating: number;
  category: string;
  description: string;
  shortDescription: string;
  image: string;
  heroImage?: string;
  trailerUrl: string;
  duration: string;
  director: string;
  cast: string[];
  featured?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  joinedDate: string;
  status: "active" | "inactive";
}

export const categories = [
  "Action",
  "Comedy",
  "Drama",
  "Horror",
  "Kids",
  "Sci-Fi",
  "Documentaries",
] as const;

export type Category = (typeof categories)[number];

export const movies: Movie[] = [
  {
    id: "1",
    title: "Marty Supreme",
    year: 2025,
    rating: 8.7,
    category: "Drama",
    description:
      "Muestra el viaje de Marty Reisman, un buscavidas convertido en campeón de ping-pong que se convirtió en el más veterano en ganar una competición nacional, con 67 años.",
    shortDescription:
      "Muestra el viaje de Marty Reisman, un buscavidas convertido en campeón de ping-pong.",
    image:
      "https://image.tmdb.org/t/p/original/lYWEXbQgRTR4ZQleSXAgRbxAjvq.jpg",
    heroImage:
      "https://image.tmdb.org/t/p/original/jBOhqsbzEL7Ks3NWy98iI7YDzBh.jpg",
    trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: "2h 35min",
    director: "Maria Chen",
    cast: ["Ana Torres", "James Reid", "Yuki Tanaka"],
    featured: true,
  },
  {
    id: "2",
    title: "Joker",
    year: 2018,
    rating: 8.4,
    category: "Drama",
    description:
      "Arthur Fleck es un hombre ignorado por la sociedad, cuya motivación en la vida es hacer reír. Pero una serie de trágicos acontecimientos le llevarán a ver el mundo de otra forma.",
    shortDescription:
      "Una serie de trágicos acontecimientos le llevarán a ver el mundo de otra forma.",
    image:
      "https://image.tmdb.org/t/p/original/mZuAPY4ETMQPHhCXIcJ90kd6RaS.jpg",
    heroImage:
      "https://image.tmdb.org/t/p/original/gZWl93sf8AxavYpVT1Un6EF3oCj.jpg",
    trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: "2h 2min",
    director: "Todd Phillips",
    cast: ["David Park", "Sofia Reyes", "Marcus Webb"],
    featured: true,
  },
  {
    id: "3",
    title: "Bring Her Back",
    year: 2025,
    rating: 8.4,
    category: "Terror",
    description:
      "Tras el fallecimiento de su padre, dos hermanos son adoptados por una mujer que vive en el bosque y cuyas actitudes les generan sospechas.",
    shortDescription:
      "Dos hermanos son adoptados por una mujer que vive en el bosque y cuyas actitudes les generan sospechas.",
    image:
      "https://image.tmdb.org/t/p/original/1Q3GlCXGYWELifxANYZ5OVMRVZl.jpg",
    heroImage:
      "https://image.tmdb.org/t/p/original/ayEo9tlBM57ICEDotqTvQLRmstu.jpg",
    trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: "1h 44min",
    director: "Danny Philippou",
    cast: ["Chris Evans", "Lena Headey", "Oscar Isaac"],
    featured: true,
  },
  {
    id: "4",
    title: "Laugh Factory",
    year: 2025,
    rating: 7.8,
    category: "Comedy",
    description:
      "When a group of aspiring comedians discover that the legendary comedy club they work at is about to be demolished, they hatch an outrageous plan to save it. Featuring hilarious set pieces, heartfelt moments, and a star-studded comedy lineup.",
    shortDescription: "A hilarious battle to save the ultimate comedy club.",
    image: "/movies/movie-2.jpg",
    trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: "1h 45min",
    director: "Rachel Kim",
    cast: ["Jake Chen", "Maria Lopez", "Tom Hardy"],
  },
  {
    id: "5",
    title: "Echoes of Silence",
    year: 2024,
    rating: 8.9,
    category: "Drama",
    description:
      "A powerful drama following three generations of a family as they confront long-buried secrets during a reunion at their ancestral home. As old wounds reopen, each family member must decide whether to cling to the past or embrace an uncertain future.",
    shortDescription: "A family confronts its deepest secrets.",
    image: "/movies/movie-3.jpg",
    trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: "2h 20min",
    director: "Sarah Mitchell",
    cast: ["Helen Mirren", "Dev Patel", "Florence Pugh"],
  },
  {
    id: "6",
    title: "The Whispering",
    year: 2025,
    rating: 7.5,
    category: "Horror",
    description:
      "A family moves into a seemingly perfect Victorian house, only to discover that the walls hold dark secrets. As supernatural events escalate, they must uncover the house's terrifying history before it consumes them all.",
    shortDescription: "The walls are alive and they have secrets.",
    image: "/movies/movie-4.jpg",
    trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: "1h 52min",
    director: "James Wan",
    cast: ["Patrick Wilson", "Vera Farmiga", "Joey King"],
  },
  {
    id: "7",
    title: "The Enchanted Grove",
    year: 2024,
    rating: 8.2,
    category: "Kids",
    description:
      "When young Lily discovers a magical doorway in her grandmother's garden, she enters a fantastical world filled with talking animals, enchanted forests, and a looming threat that only she can stop. A heartwarming animated adventure for the whole family.",
    shortDescription: "A magical world awaits beyond the garden gate.",
    image: "/movies/movie-5.jpg",
    trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: "1h 38min",
    director: "Pixar Studios",
    cast: ["Emma Watson", "Tom Hanks", "Zendaya"],
  },
  {
    id: "8",
    title: "Planet Earth: Unseen",
    year: 2025,
    rating: 9.3,
    category: "Documentaries",
    description:
      "Explore the most remote and breathtaking corners of our planet in this groundbreaking documentary series. From the deepest ocean trenches to the highest mountain peaks, witness nature's most spectacular and rarely seen phenomena.",
    shortDescription: "Discover the planet's most hidden wonders.",
    image: "/movies/movie-7.jpg",
    trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: "1h 30min",
    director: "David Attenborough",
    cast: ["David Attenborough"],
  },
  {
    id: "9",
    title: "Paris in the Rain",
    year: 2024,
    rating: 7.9,
    category: "Comedy",
    description:
      "A charming romantic comedy about two strangers who meet during a rainstorm in Paris and spend one unforgettable night exploring the city together. As dawn approaches, they must decide if one magical night can change the course of their lives forever.",
    shortDescription: "One rainy night in Paris changes everything.",
    image: "/movies/movie-9.jpg",
    trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: "1h 55min",
    director: "Jean-Pierre Moreau",
    cast: ["Lily Collins", "Lucas Bravo", "Audrey Tautou"],
  },
  {
    id: "10",
    title: "The Dark Mirror",
    year: 2025,
    rating: 8.6,
    category: "Drama",
    description:
      "A psychological thriller that follows a renowned psychiatrist who begins to lose his grip on reality when a mysterious patient forces him to confront the darkest corners of his own mind. Nothing is as it seems in this twisting, turning masterpiece of suspense.",
    shortDescription: "The mind is the most dangerous place of all.",
    image: "/movies/movie-10.jpg",
    trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: "2h 05min",
    director: "Christopher Nolan",
    cast: ["Cillian Murphy", "Robert Downey Jr.", "Emily Blunt"],
  },
  {
    id: "11",
    title: "Forest of the Damned",
    year: 2024,
    rating: 7.2,
    category: "Horror",
    description:
      "A group of hikers venture into an ancient forest where legend says the spirits of the dead still wander. When night falls and the mist rolls in, they realize the legends were true, and escape may be impossible.",
    shortDescription: "In this forest, the dead never sleep.",
    image: "/movies/movie-11.jpg",
    trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: "1h 48min",
    director: "Ari Aster",
    cast: ["Florence Pugh", "Jack Reynor", "Will Poulter"],
  },
  {
    id: "12",
    title: "Ocean Explorers",
    year: 2025,
    rating: 8.0,
    category: "Kids",
    description:
      "Join Finn the robot and his best friend Maya on an incredible underwater adventure to find the legendary Pearl of the Deep. Along the way, they'll meet fascinating sea creatures, solve puzzles, and learn the true meaning of friendship.",
    shortDescription: "An underwater adventure of a lifetime.",
    image: "/movies/movie-12.jpg",
    trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: "1h 35min",
    director: "Pixar Studios",
    cast: ["Ryan Reynolds", "Awkwafina", "Keanu Reeves"],
  },
  {
    id: "13",
    title: "Quantum Break",
    year: 2025,
    rating: 8.8,
    category: "Sci-Fi",
    description:
      "When a particle physics experiment goes catastrophically wrong, time itself begins to fracture. One scientist discovers she can navigate the broken timeline, but each jump brings her closer to a paradox that could unravel reality itself.",
    shortDescription: "Time is broken. She's the only one who can fix it.",
    image: "/movies/movie-6.jpg",
    trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: "2h 15min",
    director: "Denis Villeneuve",
    cast: ["Saoirse Ronan", "Oscar Isaac", "Tilda Swinton"],
  },
  {
    id: "14",
    title: "Wild Horizons",
    year: 2024,
    rating: 9.0,
    category: "Documentaries",
    description:
      "Follow a team of wildlife photographers as they spend a year documenting the most elusive animals on Earth. From snow leopards in the Himalayas to deep-sea creatures in the Mariana Trench, this documentary pushes the boundaries of nature filmmaking.",
    shortDescription: "The most elusive animals on Earth, finally revealed.",
    image: "/movies/movie-7.jpg",
    trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: "1h 45min",
    director: "BBC Earth",
    cast: ["David Attenborough"],
  },
  {
    id: "15",
    title: "Red Zone",
    year: 2025,
    rating: 7.6,
    category: "Action",
    description:
      "A former special forces operative is pulled back into action when her daughter is kidnapped by an international crime syndicate. With nothing to lose and time running out, she tears through a criminal underworld spanning three continents.",
    shortDescription: "She'll burn it all down to save her daughter.",
    image: "/movies/movie-8.jpg",
    trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: "2h 01min",
    director: "Chad Stahelski",
    cast: ["Charlize Theron", "Keanu Reeves", "Idris Elba"],
  },
  {
    id: "16",
    title: "Broken Strings",
    year: 2024,
    rating: 8.3,
    category: "Drama",
    description:
      "A washed-up musician gets a second chance at life when she's asked to mentor a young prodigy from a troubled background. As they prepare for a once-in-a-lifetime concert, both must face their demons and learn to trust again.",
    shortDescription: "Music heals what words cannot.",
    image: "/movies/movie-3.jpg",
    trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: "2h 10min",
    director: "Damien Chazelle",
    cast: ["Lady Gaga", "Timothee Chalamet", "Viola Davis"],
  },
  {
    id: "17",
    title: "The Birthday Heist",
    year: 2025,
    rating: 7.4,
    category: "Comedy",
    description:
      "When a dad accidentally double-books his daughter's birthday party venue with a wedding reception, chaos ensues. A laugh-out-loud comedy about the lengths parents will go to make their kids happy.",
    shortDescription: "One venue, two parties, total chaos.",
    image: "/movies/movie-2.jpg",
    trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: "1h 42min",
    director: "Taika Waititi",
    cast: ["Ryan Reynolds", "Awkwafina", "Jack Black"],
  },
  {
    id: "18",
    title: "Crimson Night",
    year: 2024,
    rating: 7.8,
    category: "Horror",
    description:
      "On the longest night of the year, a small town is plunged into darkness when the power grid fails. As something ancient stirs in the shadows, the residents must band together to survive until dawn.",
    shortDescription: "When the lights go out, they come alive.",
    image: "/movies/movie-11.jpg",
    trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: "1h 55min",
    director: "Mike Flanagan",
    cast: ["Carla Gugino", "Henry Thomas", "Kate Siegel"],
  },
  {
    id: "19",
    title: "Starship Academy",
    year: 2025,
    rating: 7.9,
    category: "Kids",
    description:
      "When 12-year-old Zara wins a scholarship to the most prestigious space academy in the galaxy, she discovers that making friends and passing exams is harder than piloting a starship. A fun animated film about courage, friendship, and reaching for the stars.",
    shortDescription: "The galaxy's most exciting school is now in session.",
    image: "/movies/movie-5.jpg",
    trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: "1h 40min",
    director: "DreamWorks Animation",
    cast: ["Zendaya", "Tom Holland", "Lupita Nyong'o"],
  },
  {
    id: "20",
    title: "The Code of Life",
    year: 2025,
    rating: 8.5,
    category: "Documentaries",
    description:
      "An eye-opening documentary that explores the cutting edge of genetic engineering and its potential to reshape humanity. Featuring interviews with the world's leading scientists, this film asks the fundamental question: should we rewrite the code of life?",
    shortDescription: "The future of humanity is being written in DNA.",
    image: "/movies/movie-7.jpg",
    trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: "1h 50min",
    director: "Werner Herzog",
    cast: ["Werner Herzog"],
  },
  {
    id: "21",
    title: "Nexus Protocol",
    year: 2024,
    rating: 8.1,
    category: "Sci-Fi",
    description:
      "In a world where consciousness can be uploaded to the cloud, a detective must solve a murder that took place inside a virtual reality simulation. The deeper she digs, the more the line between what's real and what's simulated begins to blur.",
    shortDescription: "In the cloud, death is just the beginning.",
    image: "/movies/movie-6.jpg",
    trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: "2h 08min",
    director: "Alex Garland",
    cast: ["Alicia Vikander", "Domhnall Gleeson", "Sonoya Mizuno"],
  },
];

export const featuredMovies = movies.filter((m) => m.featured);

export function getMoviesByCategory(category: Category): Movie[] {
  return movies.filter((m) => m.category === category);
}

export function getMovieById(id: string): Movie | undefined {
  return movies.find((m) => m.id === id);
}

export const mockUsers: User[] = [
  {
    id: "1",
    name: "Carlos Mendez",
    email: "carlos@email.com",
    role: "admin",
    joinedDate: "2024-01-15",
    status: "active",
  },
  {
    id: "2",
    name: "Ana Ruiz",
    email: "ana@email.com",
    role: "user",
    joinedDate: "2024-02-20",
    status: "active",
  },
  {
    id: "3",
    name: "James Wilson",
    email: "james@email.com",
    role: "user",
    joinedDate: "2024-03-10",
    status: "active",
  },
  {
    id: "4",
    name: "Yuki Tanaka",
    email: "yuki@email.com",
    role: "user",
    joinedDate: "2024-04-05",
    status: "inactive",
  },
  {
    id: "5",
    name: "Sofia Petrov",
    email: "sofia@email.com",
    role: "user",
    joinedDate: "2024-05-12",
    status: "active",
  },
  {
    id: "6",
    name: "David Park",
    email: "david@email.com",
    role: "admin",
    joinedDate: "2024-06-18",
    status: "active",
  },
  {
    id: "7",
    name: "Emma Chen",
    email: "emma@email.com",
    role: "user",
    joinedDate: "2024-07-22",
    status: "active",
  },
  {
    id: "8",
    name: "Liam O'Brien",
    email: "liam@email.com",
    role: "user",
    joinedDate: "2024-08-30",
    status: "inactive",
  },
  {
    id: "9",
    name: "Priya Sharma",
    email: "priya@email.com",
    role: "user",
    joinedDate: "2024-09-14",
    status: "active",
  },
  {
    id: "10",
    name: "Marcus Webb",
    email: "marcus@email.com",
    role: "user",
    joinedDate: "2024-10-01",
    status: "active",
  },
  {
    id: "11",
    name: "Rachel Kim",
    email: "rachel@email.com",
    role: "user",
    joinedDate: "2024-11-05",
    status: "active",
  },
  {
    id: "12",
    name: "Tom Hardy",
    email: "tom@email.com",
    role: "user",
    joinedDate: "2024-12-10",
    status: "inactive",
  },
];
