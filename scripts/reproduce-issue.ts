import prisma from "../lib/db";

async function reproduce() {
  const eventId = "cmjgssmqq001aggv240yr7d2v"; // Event ID from user's URL

  console.log("1. Fetching current event categories...");
  const initialEvent = await prisma.event.findUnique({
    where: { id: eventId },
    include: { categories: { include: { candidates: true } } },
  });

  if (!initialEvent) {
    console.error("Event not found!");
    return;
  }

  console.log("Current Categories:", initialEvent.categories.length);

  // simulate payload to add a new category
  const newCategoryName = `Test Category ${Date.now()}`;
  const payload = {
    categories: [
      ...initialEvent.categories.map((c) => ({
        id: c.id,
        name: c.name,
        description: c.description,
        candidates: c.candidates.map((cand) => ({
          id: cand.id,
          name: cand.name,
          code: cand.code,
          bio: cand.bio,
          image: cand.image,
        })),
      })),
      {
        name: newCategoryName,
        description: "Created via reproduction script",
        candidates: [],
      },
    ],
  };

  console.log("2. Simulating Client Payload (Adding 1 category)...");
  // console.log(JSON.stringify(payload, null, 2));

  // We can't easily call the Next.js API route function directly from a standalone script without mocking Request/Response objects.
  // Instead, I will replicate the LOGIC from the API route's PUT handler here to see if the Prisma logic holds up.
  // This helps confirm if my Prisma/Backend logic is correct.

  console.log("3. Executing Prisma Logic...");

  try {
    const { categories } = payload;
    if (categories && Array.isArray(categories)) {
      // 1. Identify categories to retain or delete
      const existingCategories = await prisma.eventCategory.findMany({
        where: { eventId },
        include: { candidates: true },
      });

      const existingCatIds = existingCategories.map((c) => c.id);
      const incomingCatIds = categories
        .filter((c: any) => !!(c as any).id)
        .map((c: any) => (c as any).id);
      const catsToDelete = existingCatIds.filter(
        (id) => !incomingCatIds.includes(id)
      );

      console.log("Cats to Delete:", catsToDelete);

      if (catsToDelete.length > 0) {
        // Validation: Cannot delete categories with votes
        const catsWithVotes = await prisma.eventCategory.findMany({
          where: { id: { in: catsToDelete }, totalVotes: { gt: 0 } },
        });
        if (catsWithVotes.length > 0) {
          console.error("Cannot delete category with votes");
          return;
        }
        await prisma.eventCategory.deleteMany({
          where: { id: { in: catsToDelete } },
        });
      }

      // 2. Upsert Categories
      for (const [index, cat] of categories.entries()) {
        const categoryData = cat as any;
        let categoryId = categoryData.id;

        if (categoryId && existingCatIds.includes(categoryId)) {
          // Update existing category
          await prisma.eventCategory.update({
            where: { id: categoryId },
            data: {
              name: categoryData.name,
              description: categoryData.description || null,
              sortOrder: index,
            },
          });
        } else {
          // Create new category
          console.log(`Creating new category: ${categoryData.name}`);
          const newCat = await prisma.eventCategory.create({
            data: {
              eventId,
              name: categoryData.name,
              description: categoryData.description || null,
              sortOrder: index,
              totalVotes: 0, // Default
            },
          });
          categoryId = newCat.id;
        }
      }
    }
    console.log("Success! Database logic executed.");
  } catch (err) {
    console.error("Error executing logic:", err);
  }

  console.log("4. Verifying Update...");
  const finalEvent = await prisma.event.findUnique({
    where: { id: eventId },
    include: { categories: true },
  });

  console.log("Final Categories Count:", finalEvent?.categories.length);
  const found = finalEvent?.categories.find((c) => c.name === newCategoryName);
  if (found) {
    console.log("TEST PASSED: New category found in DB.");
  } else {
    console.log("TEST FAILED: New category NOT found in DB.");
  }
}

reproduce();
