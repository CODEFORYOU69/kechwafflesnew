/**
 * Script de mise à jour des joueurs pour la CAN 2025
 * Basé sur les listes officielles BBC Afrique
 * Source: https://www.bbc.com/afrique/articles/c075x9k50dro
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Listes officielles CAN 2025 - BBC Afrique

const can2025Players: Record<string, { name: string; position: string; number?: number }[]> = {
  // ========== ALGÉRIE ==========
  ALG: [
    // Gardiens
    { name: "Oussama Benbot", position: "GOALKEEPER", number: 1 },
    { name: "Luca Zidane", position: "GOALKEEPER", number: 16 },
    { name: "Anthony Mandrea", position: "GOALKEEPER", number: 23 },
    // Défenseurs
    { name: "Rafik Belghali", position: "DEFENDER", number: 2 },
    { name: "Rayan Aït-Nouri", position: "DEFENDER", number: 3 },
    { name: "Youcef Atal", position: "DEFENDER", number: 4 },
    { name: "Mehdi Dorval", position: "DEFENDER", number: 5 },
    { name: "Jaouen Hadjam", position: "DEFENDER", number: 6 },
    { name: "Zineddine Belaïd", position: "DEFENDER", number: 13 },
    { name: "Ramy Bensebaini", position: "DEFENDER", number: 14 },
    { name: "Samir Chergui", position: "DEFENDER", number: 15 },
    { name: "Aïssa Mandi", position: "DEFENDER", number: 21 },
    { name: "Mohamed Amine Tougaï", position: "DEFENDER", number: 22 },
    // Milieux
    { name: "Ismaël Bennacer", position: "MIDFIELDER", number: 10 },
    { name: "Ramiz Zerrouki", position: "MIDFIELDER", number: 8 },
    { name: "Adem Zorgane", position: "MIDFIELDER", number: 17 },
    { name: "Hicham Boudaoui", position: "MIDFIELDER", number: 18 },
    { name: "Houssem Aouar", position: "MIDFIELDER", number: 19 },
    { name: "Farès Chaïbi", position: "MIDFIELDER", number: 11 },
    { name: "Ibrahim Maza", position: "MIDFIELDER", number: 20 },
    // Attaquants
    { name: "Mohamed Amoura", position: "FORWARD", number: 9 },
    { name: "Ilan Kebbal", position: "FORWARD", number: 24 },
    { name: "Riyad Mahrez", position: "FORWARD", number: 7 },
    { name: "Anis Hadj Moussa", position: "FORWARD", number: 25 },
    { name: "Adil Boulbina", position: "FORWARD", number: 26 },
    { name: "Monsef Bakrar", position: "FORWARD", number: 12 },
    { name: "Baghdad Bounedjah", position: "FORWARD", number: 27 },
    { name: "Redouane Berkane", position: "FORWARD", number: 28 },
  ],

  // ========== ANGOLA ==========
  ANG: [
    // Gardiens
    { name: "Neblú", position: "GOALKEEPER", number: 1 },
    { name: "Hugo Marques", position: "GOALKEEPER", number: 16 },
    { name: "Dominique", position: "GOALKEEPER", number: 22 },
    // Défenseurs
    { name: "Rui Modesto", position: "DEFENDER", number: 2 },
    { name: "Eddie Afonso", position: "DEFENDER", number: 3 },
    { name: "To Carneiro", position: "DEFENDER", number: 4 },
    { name: "Núrio Fortuna", position: "DEFENDER", number: 5 },
    { name: "Pedro Bondo", position: "DEFENDER", number: 6 },
    { name: "David Carmo", position: "DEFENDER", number: 13 },
    { name: "Jonathan Buatu", position: "DEFENDER", number: 14 },
    { name: "Kialonda Gaspar", position: "DEFENDER", number: 15 },
    { name: "Clinton Mata", position: "DEFENDER", number: 21 },
    // Milieux
    { name: "Beni Mukendi", position: "MIDFIELDER", number: 8 },
    { name: "Show", position: "MIDFIELDER", number: 17 },
    { name: "Fredy", position: "MIDFIELDER", number: 18 },
    { name: "Maestro", position: "MIDFIELDER", number: 19 },
    { name: "Manuel Keliano", position: "MIDFIELDER", number: 20 },
    { name: "Mario Balburdia", position: "MIDFIELDER", number: 23 },
    // Attaquants
    { name: "Zito Luvumbo", position: "FORWARD", number: 7 },
    { name: "Manuel Benson", position: "FORWARD", number: 9 },
    { name: "Milson", position: "FORWARD", number: 10 },
    { name: "Chico Banza", position: "FORWARD", number: 11 },
    { name: "Gelson Dala", position: "FORWARD", number: 12 },
    { name: "Randy Nteka", position: "FORWARD", number: 24 },
    { name: "Ary Papel", position: "FORWARD", number: 25 },
    { name: "Mabululu", position: "FORWARD", number: 26 },
    { name: "Mbala Nzola", position: "FORWARD", number: 27 },
    { name: "Zine", position: "FORWARD", number: 28 },
  ],

  // ========== BÉNIN ==========
  BEN: [
    // Gardiens
    { name: "Marcel Dandjinou", position: "GOALKEEPER", number: 1 },
    { name: "Saturnin Allagbé", position: "GOALKEEPER", number: 16 },
    { name: "Serge Obassa", position: "GOALKEEPER", number: 23 },
    // Défenseurs
    { name: "Attidjikou Samadou", position: "DEFENDER", number: 2 },
    { name: "Charlemagne Azongnitode", position: "DEFENDER", number: 3 },
    { name: "Rodrigue Fassinou", position: "DEFENDER", number: 4 },
    { name: "David Kiki", position: "DEFENDER", number: 5 },
    { name: "Abdoul Ra Moumini", position: "DEFENDER", number: 6 },
    { name: "Tamimou Ouorou", position: "DEFENDER", number: 13 },
    { name: "Yohan Roche", position: "DEFENDER", number: 14 },
    { name: "Mohamed Tijani", position: "DEFENDER", number: 15 },
    { name: "Olivier Verdon", position: "DEFENDER", number: 21 },
    // Milieux
    { name: "Mattéo Ahlinvi", position: "MIDFIELDER", number: 8 },
    { name: "Mariano Ahouangbo", position: "MIDFIELDER", number: 17 },
    { name: "Gislain Ahoudo", position: "MIDFIELDER", number: 18 },
    { name: "Sessi D'Almeida", position: "MIDFIELDER", number: 19 },
    { name: "Dodo Dokou", position: "MIDFIELDER", number: 20 },
    { name: "Hassane Imourane", position: "MIDFIELDER", number: 22 },
    { name: "Rodrigue Kossi", position: "MIDFIELDER", number: 24 },
    // Attaquants
    { name: "Adam Akimey", position: "FORWARD", number: 7 },
    { name: "Rodolfo Aloko", position: "FORWARD", number: 9 },
    { name: "Romaric Amoussou", position: "FORWARD", number: 10 },
    { name: "Jodel Dossou", position: "FORWARD", number: 11 },
    { name: "Steve Mounié", position: "FORWARD", number: 12 },
    { name: "Junior Olaïtan", position: "FORWARD", number: 25 },
    { name: "Razack Rachidou", position: "FORWARD", number: 26 },
    { name: "Olatoundji Tessilimi", position: "FORWARD", number: 27 },
    { name: "Aiyegun Tosin", position: "FORWARD", number: 28 },
  ],

  // ========== BOTSWANA ==========
  BOT: [
    // Gardiens
    { name: "Kabelo Dambe", position: "GOALKEEPER", number: 1 },
    { name: "Keeagile Kgosipula", position: "GOALKEEPER", number: 16 },
    { name: "Goitseone Phoko", position: "GOALKEEPER", number: 23 },
    // Défenseurs
    { name: "Mosha Gaolaolwe", position: "DEFENDER", number: 2 },
    { name: "Thatayaone Ditlhokwe", position: "DEFENDER", number: 3 },
    { name: "Tebogo Kopelang", position: "DEFENDER", number: 4 },
    { name: "Alford Velaphi", position: "DEFENDER", number: 5 },
    { name: "Mothusi Johnson", position: "DEFENDER", number: 6 },
    { name: "Chicco Molefe", position: "DEFENDER", number: 13 },
    { name: "Thabo Leinanyane", position: "DEFENDER", number: 14 },
    { name: "Shanganani Ngada", position: "DEFENDER", number: 15 },
    // Milieux
    { name: "Godiraone Modingwane", position: "MIDFIELDER", number: 8 },
    { name: "Gape Mohutsiwa", position: "MIDFIELDER", number: 17 },
    { name: "Mothusi Cooper", position: "MIDFIELDER", number: 18 },
    { name: "Lebogang Ditsele", position: "MIDFIELDER", number: 19 },
    { name: "Monty Enosa", position: "MIDFIELDER", number: 20 },
    { name: "Olebogeng Ramotse", position: "MIDFIELDER", number: 21 },
    { name: "Gilbert Baruti", position: "MIDFIELDER", number: 22 },
    { name: "Thabo Maponda", position: "MIDFIELDER", number: 24 },
    // Attaquants
    { name: "Omaatla Kebatho", position: "FORWARD", number: 7 },
    { name: "Kabelo Seakanyeng", position: "FORWARD", number: 9 },
    { name: "Thabang Sesinyi", position: "FORWARD", number: 10 },
    { name: "Tumisang Orebonye", position: "FORWARD", number: 11 },
    { name: "Segolame Boy", position: "FORWARD", number: 12 },
    { name: "Losika Ratshukudu", position: "FORWARD", number: 25 },
    { name: "Thatayaone Kgamanyane", position: "FORWARD", number: 26 },
  ],

  // ========== BURKINA FASO ==========
  BFA: [
    // Gardiens
    { name: "Hervé Koffi", position: "GOALKEEPER", number: 1 },
    { name: "Killian Nikiéma", position: "GOALKEEPER", number: 16 },
    { name: "Farid Ouédraogo", position: "GOALKEEPER", number: 23 },
    // Défenseurs
    { name: "Nasser Djiga", position: "DEFENDER", number: 2 },
    { name: "Edmond Tapsoba", position: "DEFENDER", number: 3 },
    { name: "Issoufou Dayo", position: "DEFENDER", number: 4 },
    { name: "Adamo Nagalo", position: "DEFENDER", number: 5 },
    { name: "Steeve Yago", position: "DEFENDER", number: 6 },
    { name: "Issa Kaboré", position: "DEFENDER", number: 13 },
    { name: "Arsène Kouassi", position: "DEFENDER", number: 14 },
    { name: "Abdoul Rachid Ayindé", position: "DEFENDER", number: 15 },
    // Milieux
    { name: "Blati Touré", position: "MIDFIELDER", number: 8 },
    { name: "Cédric Badolo", position: "MIDFIELDER", number: 17 },
    { name: "Saidou Simporé", position: "MIDFIELDER", number: 18 },
    { name: "Mohamed Zougrana", position: "MIDFIELDER", number: 19 },
    { name: "Gustavo Sangaré", position: "MIDFIELDER", number: 20 },
    { name: "Stéphane Aziz Ki", position: "MIDFIELDER", number: 21 },
    { name: "Ismahila Ouédraogo", position: "MIDFIELDER", number: 22 },
    // Attaquants
    { name: "Bertrand Traoré", position: "FORWARD", number: 7 },
    { name: "Dango Ouattara", position: "FORWARD", number: 9 },
    { name: "Ousseni Bouda", position: "FORWARD", number: 10 },
    { name: "Pierre Landry Kaboré", position: "FORWARD", number: 11 },
    { name: "Georgi Minoungou", position: "FORWARD", number: 12 },
    { name: "Cyriaque Irié", position: "FORWARD", number: 24 },
    { name: "Lassina Traoré", position: "FORWARD", number: 25 },
  ],

  // ========== CAMEROUN ==========
  CMR: [
    // Gardiens
    { name: "Devis Epassy", position: "GOALKEEPER", number: 1 },
    { name: "Simon Omossola", position: "GOALKEEPER", number: 16 },
    { name: "Simon Ngapandouetnbu", position: "GOALKEEPER", number: 23 },
    { name: "Édouard Sombang", position: "GOALKEEPER", number: 22 },
    // Défenseurs
    { name: "Samuel Kotto", position: "DEFENDER", number: 2 },
    { name: "Gerzino Nyamsi", position: "DEFENDER", number: 3 },
    { name: "Jean-Charles Castelletto", position: "DEFENDER", number: 4 },
    { name: "Nouhou Tolo", position: "DEFENDER", number: 5 },
    { name: "Flavien Enzo Boyomo", position: "DEFENDER", number: 6 },
    { name: "Mahamadou Nagida", position: "DEFENDER", number: 13 },
    { name: "Christopher Wooh", position: "DEFENDER", number: 14 },
    { name: "Junior Tchamadeu", position: "DEFENDER", number: 15 },
    { name: "Darling Yongwa", position: "DEFENDER", number: 21 },
    // Milieux
    { name: "Martin Ndzie", position: "MIDFIELDER", number: 8 },
    { name: "Carlos Baleba", position: "MIDFIELDER", number: 17 },
    { name: "Arthur Avom", position: "MIDFIELDER", number: 18 },
    { name: "Éric-Junior Dina Ebimbe", position: "MIDFIELDER", number: 19 },
    { name: "Brice Ambina", position: "MIDFIELDER", number: 20 },
    { name: "Jean Junior Onana", position: "MIDFIELDER", number: 24 },
    { name: "Olivier Kemen", position: "MIDFIELDER", number: 25 },
    // Attaquants
    { name: "Bryan Mbeumo", position: "FORWARD", number: 7 },
    { name: "Christian Bassogog", position: "FORWARD", number: 9 },
    { name: "Georges-Kévin Nkoudou", position: "FORWARD", number: 10 },
    { name: "Danny Namaso", position: "FORWARD", number: 11 },
    { name: "Frank Magri", position: "FORWARD", number: 12 },
    { name: "Karl Etta Eyong", position: "FORWARD", number: 26 },
    { name: "Christian Kofane", position: "FORWARD", number: 27 },
    { name: "Patrick Soko", position: "FORWARD", number: 28 },
  ],

  // ========== COMORES ==========
  COM: [
    // Gardiens
    { name: "Yannick Pandor", position: "GOALKEEPER", number: 1 },
    { name: "Salim Ben Boina", position: "GOALKEEPER", number: 16 },
    { name: "Adel Anzimati", position: "GOALKEEPER", number: 23 },
    // Défenseurs
    { name: "Kassim M'Dahoma", position: "DEFENDER", number: 2 },
    { name: "Ahmed Soilihi", position: "DEFENDER", number: 3 },
    { name: "Idris Mohamed", position: "DEFENDER", number: 4 },
    { name: "Kenan Toibibou", position: "DEFENDER", number: 5 },
    { name: "Akim Abdallah", position: "DEFENDER", number: 6 },
    { name: "Ismaël Boura", position: "DEFENDER", number: 13 },
    { name: "Yannis Kari", position: "DEFENDER", number: 14 },
    { name: "Saïd Bakary", position: "DEFENDER", number: 15 },
    // Milieux
    { name: "Yacine Bourhane", position: "MIDFIELDER", number: 8 },
    { name: "Iyad Mohamed", position: "MIDFIELDER", number: 17 },
    { name: "Raouf Mroivili", position: "MIDFIELDER", number: 18 },
    { name: "Youssouf M'Changama", position: "MIDFIELDER", number: 19 },
    { name: "Rayan Lutin", position: "MIDFIELDER", number: 20 },
    { name: "Bendjaloud Youssouf", position: "MIDFIELDER", number: 21 },
    { name: "Rémy Vita", position: "MIDFIELDER", number: 22 },
    { name: "Zaydou Youssouf", position: "MIDFIELDER", number: 24 },
    // Attaquants
    { name: "Rafiki Saïd", position: "FORWARD", number: 7 },
    { name: "Zaïd Amir", position: "FORWARD", number: 9 },
    { name: "Faïz Selemani", position: "FORWARD", number: 10 },
    { name: "El Fardou Ben Nabouhane", position: "FORWARD", number: 11 },
    { name: "Myziane Maolida", position: "FORWARD", number: 12 },
    { name: "Ahmed Aymeric", position: "FORWARD", number: 25 },
    { name: "Aboubacar Ali", position: "FORWARD", number: 26 },
  ],

  // ========== RD CONGO ==========
  COD: [
    // Gardiens
    { name: "Timothy Fayulu", position: "GOALKEEPER", number: 1 },
    { name: "Lionel Mpasi", position: "GOALKEEPER", number: 16 },
    { name: "Matthieu Epolo", position: "GOALKEEPER", number: 23 },
    // Défenseurs
    { name: "Aaron Wan-Bissaka", position: "DEFENDER", number: 2 },
    { name: "Gédéon Kalulu", position: "DEFENDER", number: 3 },
    { name: "Arthur Masuaku", position: "DEFENDER", number: 4 },
    { name: "Joris Kayembe", position: "DEFENDER", number: 5 },
    { name: "Rocky Bushiri", position: "DEFENDER", number: 6 },
    { name: "Axel Tuanzebe", position: "DEFENDER", number: 13 },
    { name: "Chancel Mbemba", position: "DEFENDER", number: 14 },
    { name: "Steve Kapuadi", position: "DEFENDER", number: 15 },
    // Milieux
    { name: "Noah Sadiki", position: "MIDFIELDER", number: 8 },
    { name: "Edo Kayembe", position: "MIDFIELDER", number: 17 },
    { name: "Samuel Moutoussamy", position: "MIDFIELDER", number: 18 },
    { name: "Charles Pickel", position: "MIDFIELDER", number: 19 },
    { name: "Ngal'ayel Mukau", position: "MIDFIELDER", number: 20 },
    { name: "Mario Stroeykens", position: "MIDFIELDER", number: 21 },
    { name: "Théo Bongonda", position: "MIDFIELDER", number: 22 },
    { name: "Michel-Ange Balikwisha", position: "MIDFIELDER", number: 24 },
    { name: "Nathanaël Mbuku", position: "MIDFIELDER", number: 25 },
    { name: "Brian Cipenga", position: "MIDFIELDER", number: 26 },
    // Attaquants
    { name: "Simon Banza", position: "FORWARD", number: 7 },
    { name: "Fiston Mayele", position: "FORWARD", number: 9 },
    { name: "Samuel Essende", position: "FORWARD", number: 10 },
    { name: "Meschack Elia", position: "FORWARD", number: 11 },
    { name: "Cédric Bakambu", position: "FORWARD", number: 12 },
  ],

  // ========== ÉGYPTE ==========
  EGY: [
    // Gardiens
    { name: "Mohamed El Shenawy", position: "GOALKEEPER", number: 1 },
    { name: "Ahmed El Shenawy", position: "GOALKEEPER", number: 16 },
    { name: "Mostafa Shobeir", position: "GOALKEEPER", number: 22 },
    { name: "Mohamed Sobhi", position: "GOALKEEPER", number: 23 },
    // Défenseurs
    { name: "Mohamed Hany", position: "DEFENDER", number: 2 },
    { name: "Ahmed Eid", position: "DEFENDER", number: 3 },
    { name: "Ramy Rabia", position: "DEFENDER", number: 4 },
    { name: "Khaled Sobhi", position: "DEFENDER", number: 5 },
    { name: "Yasser Ibrahim", position: "DEFENDER", number: 6 },
    { name: "Mohamed Ismail", position: "DEFENDER", number: 13 },
    { name: "Hossam Abdelmaguid", position: "DEFENDER", number: 14 },
    { name: "Mohamed Hamdi", position: "DEFENDER", number: 15 },
    { name: "Ahmed Fattouh", position: "DEFENDER", number: 21 },
    // Milieux
    { name: "Marwan Attia", position: "MIDFIELDER", number: 8 },
    { name: "Hamdi Fathi", position: "MIDFIELDER", number: 17 },
    { name: "Mohanad Lasheen", position: "MIDFIELDER", number: 18 },
    { name: "Mahmoud Saber", position: "MIDFIELDER", number: 19 },
    { name: "Mohamed Shehata", position: "MIDFIELDER", number: 20 },
    { name: "Emam Ashour", position: "MIDFIELDER", number: 24 },
    { name: "Zizo", position: "MIDFIELDER", number: 11 },
    { name: "Trézéguet", position: "MIDFIELDER", number: 7 },
    { name: "Ibrahim Adel", position: "FORWARD", number: 25 },
    { name: "Mostafa Fathi", position: "MIDFIELDER", number: 26 },
    // Attaquants
    { name: "Omar Marmoush", position: "FORWARD", number: 9 },
    { name: "Mohamed Salah", position: "FORWARD", number: 10 },
    { name: "Mostafa Mohamed", position: "FORWARD", number: 12 },
    { name: "Salah Mohsen", position: "FORWARD", number: 27 },
    { name: "Osama Faisal", position: "FORWARD", number: 28 },
  ],

  // ========== GUINÉE ÉQUATORIALE ==========
  GEQ: [
    // Gardiens
    { name: "Jesús Owono", position: "GOALKEEPER", number: 1 },
    { name: "Manuel Sapunga", position: "GOALKEEPER", number: 16 },
    { name: "Aitor Embela", position: "GOALKEEPER", number: 23 },
    // Défenseurs
    { name: "Esteban Orozco", position: "DEFENDER", number: 2 },
    { name: "Marvin Anieboh", position: "DEFENDER", number: 3 },
    { name: "Carlos Akapo", position: "DEFENDER", number: 4 },
    { name: "Saúl Coco", position: "DEFENDER", number: 5 },
    { name: "Basilio Ndong", position: "DEFENDER", number: 6 },
    { name: "Michael Ngaah", position: "DEFENDER", number: 13 },
    { name: "Néstor Senra", position: "DEFENDER", number: 14 },
    { name: "Charles Ondo", position: "DEFENDER", number: 15 },
    { name: "Javier Mum", position: "DEFENDER", number: 21 },
    // Milieux
    { name: "Jannick Buyla", position: "MIDFIELDER", number: 8 },
    { name: "Omar Mascarell", position: "MIDFIELDER", number: 17 },
    { name: "Pablo Ganet", position: "MIDFIELDER", number: 18 },
    { name: "Álex Masogo", position: "MIDFIELDER", number: 19 },
    { name: "Álex Balboa", position: "MIDFIELDER", number: 20 },
    { name: "José Machín", position: "MIDFIELDER", number: 22 },
    { name: "Pedro Obiang", position: "MIDFIELDER", number: 24 },
    { name: "Santiago Eneme", position: "MIDFIELDER", number: 25 },
    // Attaquants
    { name: "Iban Salvador", position: "FORWARD", number: 7 },
    { name: "Josete Miranda", position: "FORWARD", number: 9 },
    { name: "Gael Joel Akogo", position: "FORWARD", number: 10 },
    { name: "José Nabil Ondo", position: "FORWARD", number: 11 },
    { name: "Luis Asue", position: "FORWARD", number: 12 },
    { name: "Dorian Hanza", position: "FORWARD", number: 26 },
    { name: "Loren Zúñiga", position: "FORWARD", number: 27 },
    { name: "Emilio Nsue", position: "FORWARD", number: 28 },
  ],

  // ========== GABON ==========
  GAB: [
    // Gardiens
    { name: "François Bekale", position: "GOALKEEPER", number: 1 },
    { name: "Loyce Mbaba", position: "GOALKEEPER", number: 16 },
    { name: "Demba Anse Ngoubi", position: "GOALKEEPER", number: 23 },
    // Défenseurs
    { name: "Aaron Appindangoyé", position: "DEFENDER", number: 2 },
    { name: "Jonathan do Marcolino", position: "DEFENDER", number: 3 },
    { name: "Jacques Ekomié", position: "DEFENDER", number: 4 },
    { name: "Bruno Ecuele Manga", position: "DEFENDER", number: 5 },
    { name: "Johann Obiang", position: "DEFENDER", number: 6 },
    { name: "Mick Omfia", position: "DEFENDER", number: 13 },
    { name: "Anthony Oyono", position: "DEFENDER", number: 14 },
    { name: "Jérémy Oyono", position: "DEFENDER", number: 15 },
    { name: "Alex Moucketou-Moussounda", position: "DEFENDER", number: 21 },
    { name: "Uri-Michel Mboula", position: "DEFENDER", number: 22 },
    // Milieux
    { name: "Samake Nze Bagnama", position: "MIDFIELDER", number: 8 },
    { name: "Eric Bocoum", position: "MIDFIELDER", number: 17 },
    { name: "Guélor Kanga", position: "MIDFIELDER", number: 18 },
    { name: "Mario Lemina", position: "MIDFIELDER", number: 19 },
    { name: "Didier Ndong", position: "MIDFIELDER", number: 20 },
    { name: "André Biyogo Poko", position: "MIDFIELDER", number: 24 },
    { name: "Clench Louficou", position: "MIDFIELDER", number: 25 },
    // Attaquants
    { name: "Pierre-Emerick Aubameyang", position: "FORWARD", number: 7 },
    { name: "Teddy Averlant", position: "FORWARD", number: 9 },
    { name: "Denis Bouanga", position: "FORWARD", number: 10 },
    { name: "Edlin Randy Essang Matouti", position: "FORWARD", number: 11 },
    { name: "Shavy Babicka", position: "FORWARD", number: 12 },
    { name: "Royce Openda", position: "FORWARD", number: 26 },
    { name: "Jim Allevinah", position: "FORWARD", number: 27 },
    { name: "Malick Evouna", position: "FORWARD", number: 28 },
  ],

  // ========== CÔTE D'IVOIRE ==========
  CIV: [
    // Gardiens
    { name: "Yahia Fofana", position: "GOALKEEPER", number: 1 },
    { name: "Mohamed Koné", position: "GOALKEEPER", number: 16 },
    { name: "Alban Lafont", position: "GOALKEEPER", number: 23 },
    // Défenseurs
    { name: "Emmanuel Agbadou", position: "DEFENDER", number: 2 },
    { name: "Willy Boly", position: "DEFENDER", number: 3 },
    { name: "Ousmane Diomandé", position: "DEFENDER", number: 4 },
    { name: "Guela Doué", position: "DEFENDER", number: 5 },
    { name: "Ghislain Konan", position: "DEFENDER", number: 6 },
    { name: "Odilon Kossounou", position: "DEFENDER", number: 13 },
    { name: "Evan Ndicka", position: "DEFENDER", number: 14 },
    { name: "Christopher Operi", position: "DEFENDER", number: 15 },
    { name: "Armel Zohouri", position: "DEFENDER", number: 21 },
    // Milieux
    { name: "Seko Fofana", position: "MIDFIELDER", number: 8 },
    { name: "Jean-Philippe Gbamin", position: "MIDFIELDER", number: 17 },
    { name: "Christ Inao Oulaï", position: "MIDFIELDER", number: 18 },
    { name: "Franck Kessié", position: "MIDFIELDER", number: 19 },
    { name: "Ibrahim Sangaré", position: "MIDFIELDER", number: 20 },
    { name: "Jean-Michael Seri", position: "MIDFIELDER", number: 22 },
    // Attaquants
    { name: "Vakoun Bayo", position: "FORWARD", number: 7 },
    { name: "Oumar Diakité", position: "FORWARD", number: 9 },
    { name: "Amad Diallo", position: "FORWARD", number: 10 },
    { name: "Yann Diomandé", position: "FORWARD", number: 11 },
    { name: "Sébastien Haller", position: "FORWARD", number: 12 },
    { name: "Jean-Philippe Krasso", position: "FORWARD", number: 24 },
    { name: "Bazoumana Touré", position: "FORWARD", number: 25 },
    { name: "Wilfried Zaha", position: "FORWARD", number: 26 },
  ],

  // ========== MALI ==========
  MLI: [
    // Gardiens
    { name: "Djigui Diarra", position: "GOALKEEPER", number: 1 },
    { name: "Ismaël Diawara", position: "GOALKEEPER", number: 16 },
    { name: "Mamadou Samassa", position: "GOALKEEPER", number: 23 },
    // Défenseurs
    { name: "Sikou Niakaté", position: "DEFENDER", number: 2 },
    { name: "Abdoulaye Diaby", position: "DEFENDER", number: 3 },
    { name: "Woyo Coulibaly", position: "DEFENDER", number: 4 },
    { name: "Fodé Doucouré", position: "DEFENDER", number: 5 },
    { name: "Hamari Traoré", position: "DEFENDER", number: 6 },
    { name: "Nathan Gassama", position: "DEFENDER", number: 13 },
    { name: "Mamadou Fofana", position: "DEFENDER", number: 14 },
    { name: "Ousmane Camara", position: "DEFENDER", number: 15 },
    { name: "Amadou Danté", position: "DEFENDER", number: 21 },
    // Milieux
    { name: "Amadou Haïdara", position: "MIDFIELDER", number: 8 },
    { name: "Lassana Coulibaly", position: "MIDFIELDER", number: 17 },
    { name: "Mohamed Camara", position: "MIDFIELDER", number: 18 },
    { name: "Mamadou Sangaré", position: "MIDFIELDER", number: 19 },
    { name: "Aliou Dieng", position: "MIDFIELDER", number: 20 },
    { name: "Yves Bissouma", position: "MIDFIELDER", number: 10 },
    { name: "Mahamadou Doumbia", position: "MIDFIELDER", number: 22 },
    { name: "Ibrahima Sissoko", position: "MIDFIELDER", number: 24 },
    // Attaquants
    { name: "Néné Dorgelès", position: "FORWARD", number: 7 },
    { name: "Gaoussou Diarra", position: "FORWARD", number: 9 },
    { name: "Mamadou Camara", position: "FORWARD", number: 11 },
    { name: "Kamory Doumbia", position: "FORWARD", number: 12 },
    { name: "El Bilal Touré", position: "FORWARD", number: 25 },
    { name: "Mamadou Doumbia", position: "FORWARD", number: 26 },
    { name: "Lassine Sinayoko", position: "FORWARD", number: 27 },
    { name: "Gaoussou Diakité", position: "FORWARD", number: 28 },
  ],

  // ========== MAROC ==========
  MAR: [
    // Gardiens
    { name: "Yassine Bounou", position: "GOALKEEPER", number: 1 },
    { name: "Munir El Kajoui", position: "GOALKEEPER", number: 16 },
    { name: "El Mehdi Al Harrar", position: "GOALKEEPER", number: 23 },
    // Défenseurs
    { name: "Achraf Hakimi", position: "DEFENDER", number: 2 },
    { name: "Mohamed Chibi", position: "DEFENDER", number: 3 },
    { name: "Jawad El Yamiq", position: "DEFENDER", number: 4 },
    { name: "Romain Saïss", position: "DEFENDER", number: 5 },
    { name: "Abdelhamid Aït Boudlal", position: "DEFENDER", number: 6 },
    { name: "Nayef Aguerd", position: "DEFENDER", number: 13 },
    { name: "Adam Masina", position: "DEFENDER", number: 14 },
    { name: "Noussair Mazraoui", position: "DEFENDER", number: 15 },
    { name: "Anass Salah-Eddine", position: "DEFENDER", number: 21 },
    // Milieux
    { name: "Oussama Targhalline", position: "MIDFIELDER", number: 8 },
    { name: "Sofyan Amrabat", position: "MIDFIELDER", number: 17 },
    { name: "Ismaël Saibari", position: "MIDFIELDER", number: 18 },
    { name: "Neil El Aynaoui", position: "MIDFIELDER", number: 19 },
    { name: "Bilal El Khannouss", position: "MIDFIELDER", number: 20 },
    { name: "Azzedine Ounahi", position: "MIDFIELDER", number: 22 },
    // Attaquants
    { name: "Brahim Diaz", position: "FORWARD", number: 7 },
    { name: "Ilias Akhomach", position: "FORWARD", number: 9 },
    { name: "Chemsdine Talbi", position: "FORWARD", number: 10 },
    { name: "Youssef En-Nesyri", position: "FORWARD", number: 11 },
    { name: "Ayoub El Kaabi", position: "FORWARD", number: 12 },
    { name: "Soufiane Rahimi", position: "FORWARD", number: 24 },
    { name: "Abdessamad Ezzalzouli", position: "FORWARD", number: 25 },
    { name: "Eliesse Ben Seghir", position: "FORWARD", number: 26 },
  ],

  // ========== MOZAMBIQUE ==========
  MOZ: [
    // Gardiens
    { name: "Ernan", position: "GOALKEEPER", number: 1 },
    { name: "Ivane Urrubal", position: "GOALKEEPER", number: 16 },
    { name: "Kimiss Zavala", position: "GOALKEEPER", number: 23 },
    // Défenseurs
    { name: "Bruno Langa", position: "DEFENDER", number: 2 },
    { name: "Oscar", position: "DEFENDER", number: 3 },
    { name: "Diogo Calila", position: "DEFENDER", number: 4 },
    { name: "Nanani", position: "DEFENDER", number: 5 },
    { name: "Edmilson Dove", position: "DEFENDER", number: 6 },
    { name: "Reinildo Mandava", position: "DEFENDER", number: 13 },
    { name: "Mexer", position: "DEFENDER", number: 14 },
    { name: "Chamboco", position: "DEFENDER", number: 15 },
    { name: "Nené", position: "DEFENDER", number: 21 },
    // Milieux
    { name: "Dominguez", position: "MIDFIELDER", number: 8 },
    { name: "Alfonso Amade", position: "MIDFIELDER", number: 17 },
    { name: "Manuel Kambala", position: "MIDFIELDER", number: 18 },
    { name: "Keyns Abdala", position: "MIDFIELDER", number: 19 },
    { name: "João Bondé", position: "MIDFIELDER", number: 20 },
    { name: "Guima", position: "MIDFIELDER", number: 22 },
    // Attaquants
    { name: "Geny Catamo", position: "FORWARD", number: 7 },
    { name: "Faizal Bangal", position: "FORWARD", number: 9 },
    { name: "Witi", position: "FORWARD", number: 10 },
    { name: "Gildo Vilanculos", position: "FORWARD", number: 11 },
    { name: "Chamito Alfandega", position: "FORWARD", number: 12 },
    { name: "Stanley Ratifo", position: "FORWARD", number: 24 },
    { name: "Melque", position: "FORWARD", number: 25 },
  ],

  // ========== NIGERIA ==========
  NGA: [
    // Gardiens
    { name: "Stanley Nwabali", position: "GOALKEEPER", number: 1 },
    { name: "Amas Obasogie", position: "GOALKEEPER", number: 16 },
    { name: "Francis Uzoho", position: "GOALKEEPER", number: 23 },
    // Défenseurs
    { name: "Ryan Alebiosu", position: "DEFENDER", number: 2 },
    { name: "Chidozie Awaziem", position: "DEFENDER", number: 3 },
    { name: "Semi Ajayi", position: "DEFENDER", number: 4 },
    { name: "Calvin Bassey", position: "DEFENDER", number: 5 },
    { name: "Igoh Ogbu", position: "DEFENDER", number: 6 },
    { name: "Bruno Onyemaechi", position: "DEFENDER", number: 13 },
    { name: "Bright Osayi-Samuel", position: "DEFENDER", number: 14 },
    { name: "Zaidu Sanusi", position: "DEFENDER", number: 15 },
    // Milieux
    { name: "Ebenezer Akinsanmiro", position: "MIDFIELDER", number: 8 },
    { name: "Fisayo Dele-Bashiru", position: "MIDFIELDER", number: 17 },
    { name: "Alex Iwobi", position: "MIDFIELDER", number: 18 },
    { name: "Usman Muhammed", position: "MIDFIELDER", number: 19 },
    { name: "Wilfred Ndidi", position: "MIDFIELDER", number: 20 },
    { name: "Tochukwu Nnadi", position: "MIDFIELDER", number: 21 },
    { name: "Raphael Onyedika", position: "MIDFIELDER", number: 22 },
    { name: "Frank Onyeka", position: "MIDFIELDER", number: 24 },
    // Attaquants
    { name: "Akor Adams", position: "FORWARD", number: 7 },
    { name: "Samuel Chukwueze", position: "FORWARD", number: 9 },
    { name: "Cyriel Dessers", position: "FORWARD", number: 10 },
    { name: "Chidera Ejuke", position: "FORWARD", number: 11 },
    { name: "Salim Fago Lawal", position: "FORWARD", number: 12 },
    { name: "Ademola Lookman", position: "FORWARD", number: 25 },
    { name: "Paul Onuachu", position: "FORWARD", number: 26 },
    { name: "Victor Osimhen", position: "FORWARD", number: 27 },
    { name: "Moses Simon", position: "FORWARD", number: 28 },
  ],

  // ========== SÉNÉGAL ==========
  SEN: [
    // Gardiens
    { name: "Mory Diaw", position: "GOALKEEPER", number: 1 },
    { name: "Yehvann Diouf", position: "GOALKEEPER", number: 16 },
    { name: "Édouard Mendy", position: "GOALKEEPER", number: 23 },
    // Défenseurs
    { name: "Ilay Camara", position: "DEFENDER", number: 2 },
    { name: "Krépin Diatta", position: "DEFENDER", number: 3 },
    { name: "El Hadji Malick Diouf", position: "DEFENDER", number: 4 },
    { name: "Ismail Jakobs", position: "DEFENDER", number: 5 },
    { name: "Kalidou Koulibaly", position: "DEFENDER", number: 6 },
    { name: "Antoine Mendy", position: "DEFENDER", number: 13 },
    { name: "Moussa Niakhaté", position: "DEFENDER", number: 14 },
    { name: "Mamadou Sarr", position: "DEFENDER", number: 15 },
    { name: "Abdoulaye Seck", position: "DEFENDER", number: 21 },
    // Milieux
    { name: "Lamine Camara", position: "MIDFIELDER", number: 8 },
    { name: "Pathé Ciss", position: "MIDFIELDER", number: 17 },
    { name: "Habib Diarra", position: "MIDFIELDER", number: 18 },
    { name: "Idrissa Gana Gueye", position: "MIDFIELDER", number: 19 },
    { name: "Pape Gueye", position: "MIDFIELDER", number: 20 },
    { name: "Pape Matar Sarr", position: "MIDFIELDER", number: 22 },
    // Attaquants
    { name: "Boulaye Dia", position: "FORWARD", number: 7 },
    { name: "Habib Diallo", position: "FORWARD", number: 9 },
    { name: "Assane Diao", position: "FORWARD", number: 10 },
    { name: "Nicolas Jackson", position: "FORWARD", number: 11 },
    { name: "Sadio Mané", position: "FORWARD", number: 12 },
    { name: "Ibrahim Mbaye", position: "FORWARD", number: 24 },
    { name: "Chérif Ndiaye", position: "FORWARD", number: 25 },
    { name: "Iliman Ndiaye", position: "FORWARD", number: 26 },
    { name: "Cheikh Sabaly", position: "FORWARD", number: 27 },
    { name: "Ismaïla Sarr", position: "FORWARD", number: 28 },
  ],

  // ========== AFRIQUE DU SUD ==========
  RSA: [
    // Gardiens
    { name: "Sipho Chaine", position: "GOALKEEPER", number: 1 },
    { name: "Ricardo Goss", position: "GOALKEEPER", number: 16 },
    { name: "Ronwen Williams", position: "GOALKEEPER", number: 23 },
    // Défenseurs
    { name: "Samukele Kabini", position: "DEFENDER", number: 2 },
    { name: "Thabang Matuludi", position: "DEFENDER", number: 3 },
    { name: "Mbekezeli Mbokazi", position: "DEFENDER", number: 4 },
    { name: "Aubrey Modiba", position: "DEFENDER", number: 5 },
    { name: "Khuliso Mudau", position: "DEFENDER", number: 6 },
    { name: "Khulumani Ndamane", position: "DEFENDER", number: 13 },
    { name: "Siyabonga Ngezana", position: "DEFENDER", number: 14 },
    { name: "Nkosinathi Sibisi", position: "DEFENDER", number: 15 },
    { name: "Tylon Smith", position: "DEFENDER", number: 21 },
    // Milieux
    { name: "Bathusi Aubaas", position: "MIDFIELDER", number: 8 },
    { name: "Thalenthe Mbatha", position: "MIDFIELDER", number: 17 },
    { name: "Teboho Mokoena", position: "MIDFIELDER", number: 18 },
    { name: "Sphephelo Sithole", position: "MIDFIELDER", number: 19 },
    { name: "Sipho Mbule", position: "MIDFIELDER", number: 20 },
    // Attaquants
    { name: "Oswin Appollis", position: "FORWARD", number: 7 },
    { name: "Shandre Campbell", position: "FORWARD", number: 9 },
    { name: "Lyle Foster", position: "FORWARD", number: 10 },
    { name: "Evidence Makgopa", position: "FORWARD", number: 11 },
    { name: "Relebohile Mofokeng", position: "FORWARD", number: 12 },
    { name: "Elias Mokwana", position: "FORWARD", number: 22 },
    { name: "Tshepang Moremi", position: "FORWARD", number: 24 },
    { name: "Mohau Nkota", position: "FORWARD", number: 25 },
  ],

  // ========== SOUDAN ==========
  SUD: [
    // Gardiens
    { name: "Ali Abu Eshrein", position: "GOALKEEPER", number: 1 },
    { name: "Mohamed Elnour", position: "GOALKEEPER", number: 16 },
    { name: "Monged Elneel", position: "GOALKEEPER", number: 23 },
    // Défenseurs
    { name: "Mohamed Saeed", position: "DEFENDER", number: 2 },
    { name: "Altayeb Abdelrazig", position: "DEFENDER", number: 3 },
    { name: "Mustafa Abdelgadir", position: "DEFENDER", number: 4 },
    { name: "Yasser Awad", position: "DEFENDER", number: 5 },
    { name: "Bakhit Khamis", position: "DEFENDER", number: 6 },
    { name: "Mazin Mohamedein", position: "DEFENDER", number: 13 },
    { name: "Awad Zaid", position: "DEFENDER", number: 14 },
    { name: "Ahmed Abdelmonem", position: "DEFENDER", number: 15 },
    { name: "Mohamed Kesra", position: "DEFENDER", number: 21 },
    // Milieux
    { name: "Abuaagla Abdalla", position: "MIDFIELDER", number: 8 },
    { name: "Walieldin Khidr", position: "MIDFIELDER", number: 17 },
    { name: "Abdelrazig Omer", position: "MIDFIELDER", number: 18 },
    { name: "Ammar Tayfour", position: "MIDFIELDER", number: 19 },
    { name: "Alaheldin Adil", position: "MIDFIELDER", number: 20 },
    { name: "Musa Hussain", position: "MIDFIELDER", number: 22 },
    { name: "Sheddy Ezeldin", position: "MIDFIELDER", number: 24 },
    { name: "Amar Yunis", position: "MIDFIELDER", number: 25 },
    // Attaquants
    { name: "Yasser Mozamil", position: "FORWARD", number: 7 },
    { name: "Mohamed Abdelrhman", position: "FORWARD", number: 9 },
    { name: "John Otenyal", position: "FORWARD", number: 10 },
    { name: "Mohamed Eisa", position: "FORWARD", number: 11 },
    { name: "Elgozoli Hussain", position: "FORWARD", number: 12 },
    { name: "Abobaker Eisa", position: "FORWARD", number: 26 },
    { name: "Mohamed Teya", position: "FORWARD", number: 27 },
  ],

  // ========== TANZANIE ==========
  TAN: [
    // Gardiens
    { name: "Yakoub Suleiman", position: "GOALKEEPER", number: 1 },
    { name: "Hussein Masalanga", position: "GOALKEEPER", number: 16 },
    { name: "Zuberi Foba", position: "GOALKEEPER", number: 23 },
    // Défenseurs
    { name: "Bakari Mwamnyeto", position: "DEFENDER", number: 2 },
    { name: "Shomari Kapombe", position: "DEFENDER", number: 3 },
    { name: "Lusajo Mwaikenda", position: "DEFENDER", number: 4 },
    { name: "Mohamed Hussein", position: "DEFENDER", number: 5 },
    { name: "Nickson Kibabage", position: "DEFENDER", number: 6 },
    { name: "Alphonse Mabula", position: "DEFENDER", number: 13 },
    { name: "Wilson Nangu", position: "DEFENDER", number: 14 },
    { name: "Pascal Msindo", position: "DEFENDER", number: 15 },
    { name: "Ibrahim Abdulla", position: "DEFENDER", number: 21 },
    { name: "Haji Mnoga", position: "DEFENDER", number: 22 },
    { name: "Dickson Job", position: "DEFENDER", number: 24 },
    // Milieux
    { name: "Habibu Idd", position: "MIDFIELDER", number: 8 },
    { name: "Tarryn Allarakhia", position: "MIDFIELDER", number: 17 },
    { name: "Charles M'Mombwa", position: "MIDFIELDER", number: 18 },
    { name: "Yusuph Kagoma", position: "MIDFIELDER", number: 19 },
    { name: "Morice Abraham", position: "MIDFIELDER", number: 20 },
    { name: "Feisal Salum", position: "MIDFIELDER", number: 25 },
    { name: "Kelvin Nashon", position: "MIDFIELDER", number: 26 },
    { name: "Novatus Miroshi", position: "MIDFIELDER", number: 27 },
    // Attaquants
    { name: "Abdul Suleiman", position: "FORWARD", number: 7 },
    { name: "Iddy Suleiman Nado", position: "FORWARD", number: 9 },
    { name: "Kibu Denis", position: "FORWARD", number: 10 },
    { name: "Mbwana Samatta", position: "FORWARD", number: 11 },
    { name: "Kelvin John", position: "FORWARD", number: 12 },
    { name: "Simon Msuva", position: "FORWARD", number: 28 },
  ],

  // ========== TUNISIE ==========
  TUN: [
    // Gardiens
    { name: "Aymen Dahmen", position: "GOALKEEPER", number: 1 },
    { name: "Béchir Ben Saïd", position: "GOALKEEPER", number: 16 },
    { name: "Noureddine Farhati", position: "GOALKEEPER", number: 22 },
    { name: "Sabri Ben Hassen", position: "GOALKEEPER", number: 23 },
    // Défenseurs
    { name: "Yassine Meriah", position: "DEFENDER", number: 2 },
    { name: "Montassar Talbi", position: "DEFENDER", number: 3 },
    { name: "Dylan Bronn", position: "DEFENDER", number: 4 },
    { name: "Adem Arous", position: "DEFENDER", number: 5 },
    { name: "Nader Ghandri", position: "DEFENDER", number: 6 },
    { name: "Mohamed Ben Ali", position: "DEFENDER", number: 13 },
    { name: "Yan Valéry", position: "DEFENDER", number: 14 },
    { name: "Ali Abdi", position: "DEFENDER", number: 15 },
    { name: "Mortadha Ben Ouanes", position: "DEFENDER", number: 21 },
    { name: "Ali Maâloul", position: "DEFENDER", number: 24 },
    // Milieux
    { name: "Ellyes Skhiri", position: "MIDFIELDER", number: 8 },
    { name: "Houssem Tka", position: "MIDFIELDER", number: 17 },
    { name: "Ferjani Sassi", position: "MIDFIELDER", number: 18 },
    { name: "Ismaël Gharbi", position: "MIDFIELDER", number: 19 },
    { name: "Mohamed Belhadj Mahmoud", position: "MIDFIELDER", number: 20 },
    { name: "Hannibal Mejbri", position: "MIDFIELDER", number: 25 },
    { name: "Naïm Sliti", position: "MIDFIELDER", number: 26 },
    { name: "Mohamed Ali Ben Romdhane", position: "MIDFIELDER", number: 27 },
    // Attaquants
    { name: "Elias Saad", position: "FORWARD", number: 7 },
    { name: "Elias Achouri", position: "FORWARD", number: 9 },
    { name: "Sebastian Tounekti", position: "FORWARD", number: 10 },
    { name: "Firas Chaouat", position: "FORWARD", number: 11 },
    { name: "Hazem Mastouri", position: "FORWARD", number: 12 },
    { name: "Seifeddine Jaziri", position: "FORWARD", number: 28 },
  ],

  // ========== OUGANDA ==========
  UGA: [
    // Gardiens
    { name: "Salim Omar Magoola", position: "GOALKEEPER", number: 1 },
    { name: "Denis Onyango", position: "GOALKEEPER", number: 16 },
    { name: "Nafian Alionzi", position: "GOALKEEPER", number: 22 },
    { name: "Charles Lukwago", position: "GOALKEEPER", number: 23 },
    // Défenseurs
    { name: "Toby Sibbick", position: "DEFENDER", number: 2 },
    { name: "Elio Capradossi", position: "DEFENDER", number: 3 },
    { name: "Jordan Obita", position: "DEFENDER", number: 4 },
    { name: "Rogers Torach", position: "DEFENDER", number: 5 },
    { name: "Aziz Kayondo", position: "DEFENDER", number: 6 },
    { name: "Isaac Muleme", position: "DEFENDER", number: 13 },
    { name: "Timothy Awany", position: "DEFENDER", number: 14 },
    { name: "David Owori", position: "DEFENDER", number: 15 },
    { name: "Hilary Mukundane", position: "DEFENDER", number: 21 },
    // Milieux
    { name: "Kenneth Semakula", position: "MIDFIELDER", number: 8 },
    { name: "Khalid Aucho", position: "MIDFIELDER", number: 17 },
    { name: "Ronald Ssekiganda", position: "MIDFIELDER", number: 18 },
    { name: "Bobosi Byaruhanga", position: "MIDFIELDER", number: 19 },
    { name: "Baba Alhassan", position: "MIDFIELDER", number: 20 },
    // Attaquants
    { name: "Allan Okello", position: "FORWARD", number: 7 },
    { name: "Melvyn Lorenzen", position: "FORWARD", number: 9 },
    { name: "Travis Mutyaba", position: "FORWARD", number: 10 },
    { name: "Denis Omedi", position: "FORWARD", number: 11 },
    { name: "Rogers Mato", position: "FORWARD", number: 12 },
    { name: "Reagan Mpande", position: "FORWARD", number: 24 },
    { name: "Jude Ssemugabi", position: "FORWARD", number: 25 },
    { name: "Uche Ikpeazu", position: "FORWARD", number: 26 },
    { name: "Steven Mukwala", position: "FORWARD", number: 27 },
    { name: "James Bogere", position: "FORWARD", number: 28 },
  ],

  // ========== ZAMBIE ==========
  ZAM: [
    // Gardiens
    { name: "Lawrence Mulenga", position: "GOALKEEPER", number: 1 },
    { name: "Francis Mwansa", position: "GOALKEEPER", number: 16 },
    { name: "Willard Mwanza", position: "GOALKEEPER", number: 23 },
    // Défenseurs
    { name: "Stoppila Sunzu", position: "DEFENDER", number: 2 },
    { name: "Frankie Musonda", position: "DEFENDER", number: 3 },
    { name: "Kabaso Chongo", position: "DEFENDER", number: 4 },
    { name: "Mathews Banda", position: "DEFENDER", number: 5 },
    { name: "Dominic Chanda", position: "DEFENDER", number: 6 },
    { name: "Gift Mphande", position: "DEFENDER", number: 13 },
    { name: "Obino Chisala", position: "DEFENDER", number: 14 },
    { name: "David Hamansenya", position: "DEFENDER", number: 15 },
    { name: "Benson Sakala", position: "DEFENDER", number: 21 },
    // Milieux
    { name: "Miguel Chaiwa", position: "MIDFIELDER", number: 8 },
    { name: "Owen Tembo", position: "MIDFIELDER", number: 17 },
    { name: "Joseph Liteta", position: "MIDFIELDER", number: 18 },
    { name: "Kings Kangwa", position: "MIDFIELDER", number: 19 },
    { name: "Given Kalusa", position: "MIDFIELDER", number: 20 },
    { name: "David Simukonda", position: "MIDFIELDER", number: 22 },
    { name: "Wilson Chisala", position: "MIDFIELDER", number: 24 },
    { name: "Pascal Phiri", position: "MIDFIELDER", number: 25 },
    { name: "Joseph Sabobo", position: "MIDFIELDER", number: 26 },
    { name: "Lameck Banda", position: "MIDFIELDER", number: 27 },
    // Attaquants
    { name: "Fashion Sakala", position: "FORWARD", number: 7 },
    { name: "Lubambo Musonda", position: "FORWARD", number: 9 },
    { name: "Patson Daka", position: "FORWARD", number: 10 },
    { name: "Jack Lahne", position: "FORWARD", number: 11 },
    { name: "Kennedy Musonda", position: "FORWARD", number: 12 },
    { name: "Eliya Mandanji", position: "FORWARD", number: 28 },
  ],

  // ========== ZIMBABWE ==========
  ZIM: [
    // Gardiens
    { name: "Washington Arubi", position: "GOALKEEPER", number: 1 },
    { name: "Elvis Chipezeze", position: "GOALKEEPER", number: 16 },
    { name: "Martin Mapisa", position: "GOALKEEPER", number: 23 },
    // Défenseurs
    { name: "Godknows Murwira", position: "DEFENDER", number: 2 },
    { name: "Emmanuel Jalai", position: "DEFENDER", number: 3 },
    { name: "Sean Fusire", position: "DEFENDER", number: 4 },
    { name: "Munashe Garananga", position: "DEFENDER", number: 5 },
    { name: "Gerald Takwara", position: "DEFENDER", number: 6 },
    { name: "Isheanesu Mauchi", position: "DEFENDER", number: 13 },
    { name: "Brendon Galloway", position: "DEFENDER", number: 14 },
    { name: "Teenage Hadebe", position: "DEFENDER", number: 15 },
    { name: "Alec Mudimu", position: "DEFENDER", number: 21 },
    { name: "Divine Lunga", position: "DEFENDER", number: 22 },
    // Milieux
    { name: "Marvelous Nakamba", position: "MIDFIELDER", number: 8 },
    { name: "Jonah Fabisch", position: "MIDFIELDER", number: 17 },
    { name: "Andy Rinomhota", position: "MIDFIELDER", number: 18 },
    { name: "Prosper Padera", position: "MIDFIELDER", number: 19 },
    { name: "Tawanda Chirewa", position: "MIDFIELDER", number: 20 },
    { name: "Knowledge Musona", position: "MIDFIELDER", number: 24 },
    // Attaquants
    { name: "Bill Antonio", position: "FORWARD", number: 7 },
    { name: "Ishmael Wadi", position: "FORWARD", number: 9 },
    { name: "Tawanda Maswanhise", position: "FORWARD", number: 10 },
    { name: "Daniel Msendami", position: "FORWARD", number: 11 },
    { name: "Prince Dube", position: "FORWARD", number: 12 },
    { name: "Washington Navaya", position: "FORWARD", number: 25 },
    { name: "Macauley Bonne", position: "FORWARD", number: 26 },
    { name: "Junior Zindoga", position: "FORWARD", number: 27 },
    { name: "Tadiwanashe Chakuchichi", position: "FORWARD", number: 28 },
  ],
};

async function updatePlayers() {
  console.log("🔄 Mise à jour des joueurs CAN 2025 (source: BBC Afrique)...\n");

  // Get all teams
  const teams = await prisma.team.findMany();
  const teamCodeToId = new Map(teams.map((t) => [t.code, t.id]));

  let totalCreated = 0;
  let totalDeleted = 0;

  for (const [teamCode, players] of Object.entries(can2025Players)) {
    const teamId = teamCodeToId.get(teamCode);
    if (!teamId) {
      console.log(`❌ Équipe non trouvée: ${teamCode}`);
      continue;
    }

    const team = teams.find((t) => t.code === teamCode);
    console.log(`\n🏳️ ${team?.nameFr || teamCode} (${teamCode})`);

    // Delete existing players for this team
    const deleted = await prisma.player.deleteMany({
      where: { teamId },
    });
    totalDeleted += deleted.count;
    console.log(`   ↳ ${deleted.count} joueurs supprimés`);

    // Create new players
    const playersToCreate = players.map((p) => ({
      teamId,
      name: p.name,
      nameFr: p.name,
      position: p.position,
      number: p.number || null,
      goals: 0,
    }));

    await prisma.player.createMany({
      data: playersToCreate,
    });

    totalCreated += players.length;
    console.log(`   ↳ ${players.length} joueurs créés`);
  }

  console.log("\n" + "=".repeat(50));
  console.log(`✅ Mise à jour terminée!`);
  console.log(`   Total supprimés: ${totalDeleted}`);
  console.log(`   Total créés: ${totalCreated}`);
  console.log("=".repeat(50));
}

// Execute
updatePlayers()
  .then(() => {
    console.log("\n✅ Script terminé avec succès!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Erreur:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
