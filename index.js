import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

app.get("/", (_, res) => res.render("index", { title: "Home" }));
app.get("/rooms", (req, res) => {
  const rooms = [
    {
      name: "Deluxe Queen",
      slug: "deluxe-queen",
      coverImage: "/img/room1.jpg",
      hotelAddress: "123 City Center",
      pricePerNight: 120
    },
    {
      name: "Superior King",
      slug: "superior-king",
      coverImage: "/img/room2.jpg",
      hotelAddress: "123 City Center",
      pricePerNight: 170
    }
  ];
  res.render("rooms", {
    city: req.query.destination || "Ho Chi Minh City",
    checkin: req.query.checkin || "",
    checkout: req.query.checkout || "",
    rooms
  });
});

app.get("/rooms/:slug", (req, res) => {
  const room = { _id: 1, name: "Deluxe Queen", slug: req.params.slug };
  res.render("room-detail", { room });
});

app.post("/checkout", (req, res) => {
  const nights = 2;
  res.render("checkout", {
    room: { name: "Deluxe Queen" },
    checkin: "2025-06-10",
    checkout: "2025-06-12",
    nights,
    total: nights * 120
  });
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
