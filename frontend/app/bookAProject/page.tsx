"use client";

import { useEffect, useState } from "react";
import "../css/bookAProject.css";

interface Booking {
    service: string;
    serviceType: string;
    clientName: FormDataEntryValue | null;
    clientPhone: FormDataEntryValue | null;
    addons: string[];
    total: number;
    createdAt: string;
}

type ServiceType = "svadba" | "rodjendan" | "matura";

export default function BookAProject() {
    const [lang, setLang] = useState<"mk" | "en">("mk");
    const [isReady, setIsReady] = useState(false);

    const text = {
        mk: {
            noDate: "Нема избран датум",
            svadba: "Свадба",
            rodjendan: "Роденден",
            matura: "Матура",
            name: "Име",
            clientName: "Име и презиме",
            phone: "Телефон",
            reserve: "Резервирај",
            total: "Вкупно",
            previousMonth: "Претходен месец",
            nextMonth: "Следен месец",
            calendar: "Календар за резервација",
            details: "Детали за резервација",
            packagePrice: "Цена на пакет",
            ok: "Во ред",
            loveStory: "Свадбен Трејлер",
            crane: "Кран",
            drone: "Дрон",
        },
        en: {
            noDate: "No date selected",
            svadba: "Wedding",
            rodjendan: "Birthday",
            matura: "Graduation",
            name: "Name",
            clientName: "Client name",
            phone: "Phone",
            reserve: "Reserve",
            total: "Total",
            previousMonth: "Previous month",
            nextMonth: "Next month",
            calendar: "Booking calendar",
            details: "Reservation details",
            packagePrice: "Package price",
            ok: "OK",
            loveStory: "Love Story",
            crane: "Crane",
            drone: "Drone",

        },
    };
    useEffect(() => {
        const savedLang = localStorage.getItem("siteLang") as "mk" | "en" | null;

        if (savedLang === "mk" || savedLang === "en") {
            setLang(savedLang);
        }

        setIsReady(true);

        const handleLanguageChange = (event: Event) => {
            const customEvent = event as CustomEvent<"mk" | "en">;
            setLang(customEvent.detail);
        };

        window.addEventListener("languagechange", handleLanguageChange);

        return () => {
            window.removeEventListener("languagechange", handleLanguageChange);
        };
    }, []);
    useEffect(() => {
        const basePrices: Record<ServiceType, number> = {
                svadba: 500,
            rodjendan: 200,
            matura: 250,
        };

        const serviceLabels: Record<ServiceType, string> = {
            svadba: "Свадба",
            rodjendan: "Роденден",
            matura: "Матура",
        };

        const addonPrices: Record<string, number> = {
            loveStory: 100,
            crane: 200,
            drone: 150,
        };

        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December",
        ];

        const calendarTitle = document.querySelector<HTMLElement>("[data-calendar-title]");
        const calendarGrid = document.querySelector<HTMLElement>("[data-calendar-grid]");
        const selectedDateLabel = document.querySelector<HTMLElement>("[data-selected-date]");
        const totalPriceLabel = document.querySelector<HTMLElement>("[data-total-price]");
        const baseLabel = document.querySelector<HTMLElement>("[data-base-label]");
        const basePriceLabel = document.querySelector<HTMLElement>("[data-base-price]");
        const bookingForm = document.querySelector<HTMLFormElement>("[data-booking-form]");
        const bookButton = document.querySelector<HTMLButtonElement>("[data-book-button]");
        const statusMessage = document.querySelector<HTMLElement>("[data-status-message]");
        const addonInputs = document.querySelectorAll<HTMLInputElement>("[data-addon]");
        const prevMonthBtn = document.querySelector<HTMLButtonElement>("[data-prev-month]");
        const nextMonthBtn = document.querySelector<HTMLButtonElement>("[data-next-month]");
        const serviceTabs = document.querySelectorAll<HTMLButtonElement>("[data-service]");

        const resultModal = document.querySelector<HTMLElement>("[data-result-modal]");
        const resultTitle = document.querySelector<HTMLElement>("[data-result-title]");
        const resultText = document.querySelector<HTMLElement>("[data-result-text]");
        const resultClose = document.querySelector<HTMLButtonElement>("[data-result-close]");

        if (
            !calendarTitle || !calendarGrid || !selectedDateLabel || !totalPriceLabel || !baseLabel || !basePriceLabel ||
            !bookingForm || !bookButton || !statusMessage || !prevMonthBtn || !nextMonthBtn ||
            !serviceTabs.length || !resultModal || !resultTitle || !resultText || !resultClose
        ) {
            return;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let visibleDate = new Date(today.getFullYear(), today.getMonth(), 1);
        let selectedDate = "";
        let serviceType: ServiceType = "svadba";
        let bookings: Record<string, Booking> = {};

        const pad = (value: number) => String(value).padStart(2, "0");
        const toDateKey = (date: Date) =>
            `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

        const formatDate = (dateKey: string) => {
            if (!dateKey) {
                return "No date selected";
            }

            const [year, month, day] = dateKey.split("-");
            return `${day}.${month}.${year}`;
        };

        const getSelectedAddons = () => {
            if (serviceType !== "svadba") {
                return [];
            }

            return Array.from(addonInputs)
                .filter((input) => input.checked)
                .map((input) => input.dataset.addon as string);
        };

        const calculateTotal = () => {
            return getSelectedAddons().reduce((total, addon) => {
                return total + (addonPrices[addon] ?? 0);
            }, basePrices[serviceType]);
        };

        const updateTotal = () => {
            baseLabel.textContent = serviceLabels[serviceType];
            basePriceLabel.textContent = `${basePrices[serviceType]}€`;
            totalPriceLabel.textContent = `${calculateTotal()}€`;
        };
        const addonGrid = document.querySelector<HTMLElement>("[data-addon-grid]");
        const addonPriceRows = document.querySelectorAll<HTMLElement>("[data-addon-price-row]");

        const updateAddonsVisibility = () => {
            const showAddons = serviceType === "svadba";

            addonGrid?.classList.toggle("is-hidden", !showAddons);
            addonPriceRows.forEach((row) => row.classList.toggle("is-hidden", !showAddons));

            if (!showAddons) {
                addonInputs.forEach((input) => {
                    input.checked = false;
                });
            }
        };
        const setStatus = (message: string, type = "") => {
            statusMessage.textContent = message;
            statusMessage.className = `status-message${type ? ` is-${type}` : ""}`;
        };
        const showResultPopup = (success: boolean, message: string) => {
            resultTitle.textContent = success ? "Успешно испратено" : "Неуспешно испраќање";
            resultText.textContent = message;
            resultModal.classList.remove("is-hidden");
        };

        const closeResultPopup = () => {
            resultModal.classList.add("is-hidden");
        };
        const renderCalendar = () => {
            calendarGrid.innerHTML = "";
            calendarTitle.textContent = `${monthNames[visibleDate.getMonth()]} ${visibleDate.getFullYear()}`;

            const year = visibleDate.getFullYear();
            const month = visibleDate.getMonth();
            const firstDay = new Date(year, month, 1);
            const lastDay = new Date(year, month + 1, 0);
            const leadingDays = (firstDay.getDay() + 6) % 7;
            const totalCells = Math.ceil((leadingDays + lastDay.getDate()) / 7) * 7;

            for (let index = 0; index < totalCells; index += 1) {
                const dateNumber = index - leadingDays + 1;
                const cell = document.createElement("button");
                cell.className = "day-cell";
                cell.type = "button";

                if (dateNumber < 1 || dateNumber > lastDay.getDate()) {
                    cell.classList.add("is-muted");
                    cell.disabled = true;
                    calendarGrid.appendChild(cell);
                    continue;
                }

                const cellDate = new Date(year, month, dateNumber);
                const dateKey = toDateKey(cellDate);
                const isPast = cellDate < today;
                const isBooked = Boolean(bookings[dateKey]);

                // Number only — no repeated "Free"/"Booked" text, status is
                // communicated purely through cell color (see legend).
                cell.innerHTML = `<span class="day-number">${dateNumber}</span>`;
                cell.setAttribute("aria-label", `${formatDate(dateKey)} ${isBooked ? "booked" : "free"}`);

                if (dateKey === selectedDate) {
                    cell.classList.add("is-selected");
                }

                if (isPast) {
                    cell.classList.add("is-past");
                    cell.disabled = true;
                }

                if (isBooked) {
                    cell.classList.add("is-booked");
                    cell.disabled = true;
                }

                cell.addEventListener("click", () => updateSelectedDate(dateKey));
                calendarGrid.appendChild(cell);
            }
        };

        const updateSelectedDate = (dateKey: string) => {
            selectedDate = dateKey;
            selectedDateLabel.textContent = formatDate(selectedDate);
            bookButton.disabled = !selectedDate || Boolean(bookings[selectedDate]);
            setStatus("");
            renderCalendar();
        };

        const handlePrevMonth = () => {
            visibleDate = new Date(visibleDate.getFullYear(), visibleDate.getMonth() - 1, 1);
            renderCalendar();
        };

        const handleNextMonth = () => {
            visibleDate = new Date(visibleDate.getFullYear(), visibleDate.getMonth() + 1, 1);
            renderCalendar();
        };

        prevMonthBtn.addEventListener("click", handlePrevMonth);
        nextMonthBtn.addEventListener("click", handleNextMonth);

        addonInputs.forEach((input) => {
            input.addEventListener("change", updateTotal);
        });

        const handleServiceTabClick = (tab: HTMLButtonElement) => () => {
            serviceTabs.forEach((item) => item.classList.remove("is-active"));
            tab.classList.add("is-active");
            serviceType = tab.dataset.service as ServiceType;
            updateAddonsVisibility();
            updateTotal();
        };

        serviceTabs.forEach((tab) => {
            tab.addEventListener("click", handleServiceTabClick(tab));
            resultClose.addEventListener("click", closeResultPopup);
        });

        const handleSubmit = async (event: SubmitEvent) => {
            event.preventDefault();

            if (!selectedDate) {
                showResultPopup(false, "Ве молиме изберете датум.");
                return;
            }

            const formData = new FormData(bookingForm);
            const clientPhone = formData.get("clientPhone");

            bookButton.disabled = true;
            setStatus("Се испраќа барањето...", "");

            try {
                const response = await fetch("http://localhost:8080/api/booking-request", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        bookingDate: selectedDate,
                        service: serviceLabels[serviceType],
                        serviceType,
                        clientName: formData.get("clientName"),
                        clientPhone,
                        addons: getSelectedAddons(),
                        total: calculateTotal(),
                    }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || "Request failed");
                }

                showResultPopup(
                    true,
                    `Барањето за ${formatDate(selectedDate)} е испратено. Ќе ве контактираме наскоро.`
                );

                setStatus("");
                bookingForm.reset();
                selectedDate = "";
                selectedDateLabel.textContent = formatDate(selectedDate);
                bookButton.disabled = true;
                updateAddonsVisibility();
                updateTotal();
                renderCalendar();
            } catch (error) {
                console.error(error);
                showResultPopup(
                    false,
                    error instanceof Error ? error.message : "Baranjeto ne bese isprateno."
                );
                setStatus("");
                bookButton.disabled = false;
            }
        };

        // @ts-ignore
        bookingForm.addEventListener("submit", handleSubmit as EventListener);
        updateAddonsVisibility();
        updateTotal();
        renderCalendar();

        return () => {
            prevMonthBtn.removeEventListener("click", handlePrevMonth);
            nextMonthBtn.removeEventListener("click", handleNextMonth);
            addonInputs.forEach((input) => {
                input.removeEventListener("change", updateTotal);
            });

            serviceTabs.forEach((tab) => {
                tab.removeEventListener("click", handleServiceTabClick(tab));
                resultClose.removeEventListener("click", closeResultPopup);
            });

            // @ts-ignore
            bookingForm.removeEventListener("submit", handleSubmit as EventListener);
        };
    }, []);

    return (
        <>
            <div className="booking-modal is-hidden" data-result-modal>
                <div className="booking-modal-box">
                    <h2 data-result-title></h2>
                    <p data-result-text></p>
                    <button className="button" type="button" data-result-close>
                        Во ред
                    </button>
                </div>
            </div>



            <main>
                <section className="section-shell" aria-label="Book a project">
                    <div className="service-tabs" role="tablist" aria-label="Service type">
                        <button className="tab is-active" type="button" data-service="svadba">
                            {text[lang].svadba}
                        </button>
                        <button className="tab" type="button" data-service="rodjendan">
                            {text[lang].rodjendan}
                        </button>
                        <button className="tab" type="button" data-service="matura">
                            {text[lang].matura}
                        </button>
                    </div>

                    <div className="booking-layout">
                        <section className="calendar-panel" aria-label={text[lang].calendar}>
                            <div className="calendar-head">
                                <button
                                    className="icon-button"
                                    type="button"
                                    aria-label={text[lang].previousMonth}
                                    data-prev-month
                                >
                                    &larr;
                                </button>
                                <h2 className="calendar-title" data-calendar-title>
                                    Month Year
                                </h2>
                                <button
                                    className="icon-button"
                                    type="button"
                                    aria-label={text[lang].nextMonth}
                                    data-next-month
                                >
                                    &rarr;
                                </button>
                            </div>

                            <div className="weekdays" aria-hidden="true">
                                <span>Mon</span>
                                <span>Tue</span>
                                <span>Wed</span>
                                <span>Thu</span>
                                <span>Fri</span>
                                <span>Sat</span>
                                <span>Sun</span>
                            </div>
                            <div className="calendar-grid" data-calendar-grid></div>


                        </section>

                        <aside className="booking-panel" aria-label={text[lang].details}>
                            <div className="selected-date" data-selected-date>
                                {text[lang].noDate}
                            </div>

                            <form data-booking-form>
                                <div className="field-group">
                                    <div className="field">
                                        <label htmlFor="client-name">{text[lang].name}</label>
                                        <input id="client-name" name="clientName" type="text" placeholder={text[lang].clientName} required />
                                    </div>
                                    <div className="field">
                                        <label htmlFor="client-phone">{text[lang].phone}</label>
                                        <input id="client-phone" name="clientPhone" type="tel" placeholder="+389..." required />
                                    </div>
                                </div>

                                <div className="option-grid" data-addon-grid>
                                    <label className="option-card">
                                        <input type="checkbox" data-addon="loveStory" />
                                        <strong>{text[lang].loveStory}</strong>
                                        <span>+100€</span>
                                    </label>
                                    <label className="option-card">
                                        <input type="checkbox" data-addon="crane" />
                                        <strong>{text[lang].crane}</strong>
                                        <span>+200€</span>
                                    </label>
                                    <label className="option-card">
                                        <input type="checkbox" data-addon="drone" />
                                        <strong>{text[lang].drone}</strong>
                                        <span>+150€</span>
                                    </label>
                                </div>

                                <button className="button" type="submit" data-book-button disabled>
                                    {text[lang].reserve}
                                </button>
                                <div className="status-message" data-status-message></div>
                            </form>

                            <div className="price-box" aria-label={text[lang].packagePrice}>
                                <div className="price-row">
                                    <span data-base-label>{text[lang].svadba}</span>
                                    <strong data-base-price>500€</strong>
                                </div>

                                <div className="price-row" data-addon-price-row>
                                    <span>{text[lang].loveStory}</span>
                                    <strong>+100€</strong>
                                </div>

                                <div className="price-row" data-addon-price-row>
                                    <span>{text[lang].crane}</span>
                                    <strong>+200€</strong>
                                </div>

                                <div className="price-row" data-addon-price-row>
                                    <span>{text[lang].drone}</span>
                                    <strong>+150€</strong>
                                </div>

                                <div className="price-total">
                                    <span>{text[lang].total}</span>
                                    <strong data-total-price>500€</strong>
                                </div>
                            </div>
                        </aside>
                    </div>
                </section>
            </main>
        </>
    );
}
