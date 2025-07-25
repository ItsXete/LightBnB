INSERT INTO users (name, email, password) VALUES
  ('Travis Scott', 'travis@example.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
  ('Kanye West', 'kanye@example.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
  ('The Weeknd', 'weeknd@example.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');


INSERT INTO properties (
  owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night,
  parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code, active
) VALUES
  (1, 'Speed lamp', 'description', 'https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg?auto=compress&cs=tinysrgb&h=350', 'https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg', 93061, 6, 4, 8, 'Canada', '536 Namsub Highway', 'Sotboske', 'Quebec', '28142', TRUE),
  (1, 'Blank corner', 'description', 'https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg?auto=compress&cs=tinysrgb&h=350', 'https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg', 85234, 6, 6, 7, 'Canada', '651 Nami Road', 'Bohbatev', 'Alberta', '83680', TRUE),
  (2, 'Habit mix', 'description', 'https://images.pexels.com/photos/2080018/pexels-photo-2080018.jpeg?auto=compress&cs=tinysrgb&h=350', 'https://images.pexels.com/photos/2080018/pexels-photo-2080018.jpeg', 46058, 0, 5, 6, 'Canada', '1650 Hejto Center', 'Genwezuj', 'Newfoundland And Labrador', '44583', TRUE);


INSERT INTO reservations (start_date, end_date, property_id, guest_id) VALUES
  ('2025-08-01', '2025-08-05', 2, 1),
  ('2025-09-10', '2025-09-15', 1, 3),
  ('2025-07-20', '2025-07-22', 3, 2);

INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message) VALUES
  (1, 2, 1, 5, 'Review 1.'),
  (3, 1, 2, 4, 'Review 2.'),
  (2, 3, 3, 3, 'Review 3.');