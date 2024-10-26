"use client";

import { InfinityScroll } from "@/component/InfinityScroll";
import { ProductProps, ProductResponse, reviewProps } from "@/types/dummy";
import { useEffect, useState } from "react";
import Image from "next/image";
import { FaStar } from "react-icons/fa";

export default function Home() {
  const [page, setPage] = useState(0);
  const [data, setData] = useState<ProductProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);
  const [total, setTotal] = useState(1);
  const [hoveredReview, setHoveredReview] = useState<reviewProps | null>(null);

  useEffect(() => {
    if (fetched) return;
    handleFetchMore();
  }, []);

  const handleFetchMore = async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    let newPage = page;
    const limit = 30;
    const skip = limit * newPage;
    newPage += 1;

    if (data.length >= total) return;

    setLoading(true);

    try {
      const res = await fetch(
        `https://dummyjson.com/products?limit=${limit}&skip=${skip}`
      );
      const response: ProductResponse = await res.json();
      setTotal(response.total);
      setData((prevData) => [...prevData, ...response.products]);
      clearTimeout(timeoutId);
    } catch (err) {
      console.log(err);
    } finally {
      setPage(newPage);
      setFetched(true);
      setLoading(false);
    }
  };

  if (!data || data.length === 0)
    return <div className="w-full flex spinner justify-center items-center" />;

  return (
    <div className=" w-full px-4 pb-20">
      <InfinityScroll
        fetchMore={handleFetchMore}
        loading={loading}
        customClass="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5 pb-4"
        reachMax={data.length >= total}
      >
        {data.map((item) => {
          const rate = Math.ceil(item.rating);
          return (
            <div
              key={item.id}
              className="border-2 border-gray-500 justify-between p-4 flex flex-col gap-3"
            >
              <div>
                <div className="w-full h-auto aspect-square ">
                  <Image
                    src={item.images[0]}
                    alt="productImage"
                    width={350}
                    height={350}
                    className="w-full h-full object-contain"
                  />
                </div>
                <h1 className="text-lg text-left font-semibold">
                  {item.title}
                </h1>
                <p className="text-sm text-gray-400">{item.description}</p>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex gap-1">
                  {Array.from({ length: rate }, (_, i) => (
                    <div
                      key={i}
                      onMouseEnter={() =>
                        setHoveredReview(item.reviews[i] || null)
                      }
                      onMouseLeave={() => setHoveredReview(null)}
                      className="relative"
                    >
                      <FaStar className="text-yellow-400" />
                      {hoveredReview && hoveredReview === item.reviews[i] && (
                        <div className="absolute bg-white top-6 left-0 p-2 border border-gray-300 rounded-lg">
                          <div className="flex justify-between gap-5 items-center mb-2">
                            <p className="text-sm font-semibold text-nowrap">
                              {hoveredReview.reviewerName}
                            </p>
                            <p className="text-sm text-gray-400 text-nowrap">
                              {hoveredReview.date}
                            </p>
                          </div>
                          <p className="text-sm text-gray-400 mb-2">
                            {hoveredReview.comment}
                          </p>
                          <p className="text-sm text-gray-400">
                            {hoveredReview.reviewerEmail}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-400 flex justify-end ">
                  ${item.price}
                </p>
              </div>
            </div>
          );
        })}
      </InfinityScroll>
    </div>
  );
}
