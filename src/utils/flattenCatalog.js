export const flattenCatalog = (catalog) => {
  const flatProducts = [];

  catalog.forEach((brand) => {
    brand.models.forEach((model) => {
      model.systems.forEach((system) => {
        system.products.forEach((product) => {
          flatProducts.push({
            id: product.id,
            name: product.name,
            code: product.code,
            description: product.description,
            image: product.image,

            brandId: brand.id,
            brand: brand.name,

            modelId: model.id,
            model: model.name,

            systemId: system.id,
            system: system.name,
          });
        });
      });
    });
  });

  return flatProducts;
};
