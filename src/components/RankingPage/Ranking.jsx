"use client";

import React, { useState } from "react";
import styles from "./Ranking.module.css";

const MOCK_ALL_RANKING = [
  { id: 1, name: "User 1", points: 754, rank: 1 },
  { id: 2, name: "User 2", points: 641, rank: 2 },
  { id: 3, name: "User 3", points: 610, rank: 3 },
  { id: 4, name: "User 4", points: 580, rank: 4 },
  { id: 5, name: "User 5", points: 569, rank: 5 },
  { id: 6, name: "User 6", points: 489, rank: 6 },
  { id: 7, name: "User 7", points: 321, rank: 7 },
];

const MOCK_REGION_RANKING = [
  { id: 1, name: "Region User 1", points: 520, rank: 1 },
  { id: 2, name: "Region User 2", points: 498, rank: 2 },
  { id: 3, name: "Region User 3", points: 430, rank: 3 },
  { id: 4, name: "Region User 4", points: 410, rank: 4 },
];

export default function Ranking() {
  const [activeTab, setActiveTab] = useState("all");


  const rankingData =
    activeTab === "all" ? MOCK_ALL_RANKING : MOCK_REGION_RANKING;

  return (
    <div className={styles.container}>
      {/* 탭 영역 */}
      <div className={styles.tabWrapper}>
        <button
          type="button"
          className={`${styles.tabButton} ${
            activeTab === "all" ? styles.tabButtonActive : ""
          }`}
          onClick={() => setActiveTab("all")}
        >
          전체랭킹
        </button>
        <button
          type="button"
          className={`${styles.tabButton} ${
            activeTab === "region" ? styles.tabButtonActive : ""
          }`}
          onClick={() => setActiveTab("region")}
        >
          지역랭킹
        </button>
      </div>

      {/* 랭킹 리스트 */}
      <ul className={styles.list}>
        {rankingData.map((user) => (
          <li key={user.id} className={styles.item}>
            <div className={styles.avatar} />

            <div className={styles.info}>
              <div className={styles.name}>{user.name}</div>
              <div className={styles.points}>{user.points} pts</div>
            </div>

            <div className={styles.rank}>#{user.rank}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
