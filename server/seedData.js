// server/seedData.js - Relational Synthetic Seed Data Generator for CivicOne Vault

export function generateSyntheticCitizens() {
  const firstNames = ["Rajesh", "Ananya", "Vikramaditya", "Priya", "Devendra", "Sunita", "Amit", "Kavita", "Siddharth", "Meera", "Rohan", "Sneha", "Arjun", "Pooja", "Varun", "Deepika", "Karan", "Ritu", "Alok", "Divya"];
  const lastNames = ["Kumar", "Sharma", "Rao", "Sundaram", "Patel", "Deshmukh", "Verma", "Joshi", "Kapoor", "Nair", "Mehta", "Iyer", "Chawla", "Gupta", "Malhotra", "Reddy", "Bhatia", "Sethi", "Singhania", "Trivedi"];
  const cities = ["Mumbai", "Bengaluru", "New Delhi", "Hyderabad", "Pune", "Chennai", "Ahmedabad", "Kolkata", "Jaipur", "Chandigarh"];

  return firstNames.map((firstName, i) => {
    const idx = (i + 1).toString().padStart(2, '0');
    const citizenId = `CIV-1000${idx}`;
    const lastName = lastNames[i];
    const fullName = `${firstName} ${lastName}`;
    const city = cities[i % cities.length];
    const isGold = i % 2 === 0;

    return {
      id: `cit-${100 + i}`,
      citizenId,
      fullName,
      displayName: firstName,
      dateOfBirth: `${(10 + i) % 28 + 1}-08-${1985 + (i % 15)}`,
      gender: i % 2 === 0 ? "Male" : "Female",
      profileImage: i % 2 === 0 
        ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400"
        : "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400",
      mobileMasked: `+91 98${i.toString().padStart(2, '0')}4 56789`,
      emailMasked: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@civicone.gov.in`,
      addressSummary: `Flat ${(i + 1) * 102}, Civic Heights, ${city}, India`,
      trustLevel: isGold ? "VIP Tier Gold" : "Standard Verified",
      verificationStatus: "VERIFIED",
      securityScore: 92 + (i % 8),
      createdAt: "2026-01-15T09:30:00Z",
      virtualCardId: `VCD-GOLD-1000${idx}`,
      virtualCardStatus: "ACTIVE",
      tier: isGold ? "GOLD" : "STANDARD"
    };
  });
}

console.log("Synthetic seed data generator ready.");
