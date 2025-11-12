"use client";


export default function Section({
title,
id,
children,
}: {
title: string;
id?: string;
children: React.ReactNode;
}) {
return (
<section className="mt-6">
{/* Invisible anchor for smooth in-page links (compensates for sticky headers) */}
{id ? <span id={id} className="block -mt-24 pt-24" aria-hidden /> : null}
<h2 className="text-xl font-semibold text-gray-700">{title}</h2>
<div className="text-gray-700 mt-2 space-y-2">{children}</div>
</section>
);
}