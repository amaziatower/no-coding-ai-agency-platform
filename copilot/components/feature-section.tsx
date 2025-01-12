import Image from "next/image";
import { useTranslations } from "next-intl";

// Feature data structured in a list

export function FeatureSection() {
  const t = useTranslations("IndexPage");

  const features = [
    {
      id: 1,
      title: t("features1-title"),
      description: t("features1-text"),
      imageSrc: "/phone.png",
      imageAlt: "Feature 1",
    },
    {
      id: 2,
      title: t("features2-title"),
      description: t("features2-text"),
      imageSrc: "/phone2.png",
      imageAlt: "Feature 2",
    },
    {
      id: 3,
      title: t("features3-title"),
      description: t("features3-text"),
      imageSrc: "/phone3.png",
      imageAlt: "Feature 3",
    },
  ];

  return (
    <section className="flex-col items-center gap-4 sm:flex-col md:flex-row lg:flex-row ">
      {features.map((feature, index) => (
        <div
          key={feature.id}
          className="md:w-7/10 container flex flex-col items-center justify-between gap-4 p-4 md:flex-row"
        >
          {index % 2 === 0 ? (
            <>
              <div className="size-auto w-full md:w-1/2">
                <Image
                  alt={feature.imageAlt}
                  height={300} // Set the appropriate height
                  src={feature.imageSrc}
                  width={500} // Set the appropriate width
                />
              </div>
              <div className="mt-2 md:w-1/2">
                <h2 className="text-2xl font-bold">{feature.title}</h2>
                <p className="text-sm font-bold text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-4 text-right md:w-1/2">
                <h2 className="text-2xl font-bold">{feature.title}</h2>
                <p className="text-sm font-bold text-muted-foreground">
                  {feature.description}
                </p>
              </div>
              <div className="size-auto w-full md:w-1/2">
                <Image
                  alt={feature.imageAlt}
                  height={300} // Set the appropriate height
                  src={feature.imageSrc}
                  width={500} // Set the appropriate width
                />
              </div>
            </>
          )}
        </div>
      ))}
    </section>
  );
}

export default FeatureSection;
