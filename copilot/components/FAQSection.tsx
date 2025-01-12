import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "components/ui/accordion";
import { faqDataEn, faqDataFr } from "config/faq";

interface FAQ {
  question: string;
  answer: string;
}

interface FAQData {
  title: string;
  items: Array<FAQ>;
}

export function FAQSection({ lang }: { lang: string }) {
  const faqData = lang === "en" ? faqDataEn : faqDataFr;
  const chunkFAQData = (data: Array<FAQ>, size: number): Array<Array<FAQ>> => {
    const result: Array<Array<FAQ>> = [];
    for (let i = 0; i < data.length; i += size) {
      result.push(data.slice(i, i + size));
    }
    return result;
  };

  const faqChunks = chunkFAQData(faqData.items, 2);
  return (
    <div className="mx-auto flex flex-col gap-6 bg-background text-left sm:w-full md:w-4/5">
      <h2 className="text-left font-heading text-lg leading-[1.1] sm:text-2xl md:text-4xl">
        {faqData.title}
      </h2>
      <div className="border-5 container flex h-full flex-row gap-6 border-gray-300 text-left">
        {faqChunks.map((chunk: Array<FAQ>, chunkIndex: number) => (
          <Accordion
            key={chunkIndex}
            className="size-full text-left"
            collapsible
            type="single"
          >
            {chunk.map((faq: FAQ, index: number) => (
              <AccordionItem key={index} value={`item-${chunkIndex}-${index}`}>
                <AccordionTrigger className="border-5 size-full h-full border-gray-300 text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="size-full text-left">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ))}
      </div>
    </div>
  );
}
