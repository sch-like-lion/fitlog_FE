"use client";

import { useState, useEffect } from "react";

export default function Page() {
    // --- 상태 관리 ---
    const [exercises, setExercises] = useState([]); // 운동 목록
    const [loading, setLoading] = useState(false);  // 로딩 상태

    // 모달(팝업) 상태
    const [activeModal, setActiveModal] = useState(null); // 'create', 'edit', 'delete' or null
    const [selectedExercise, setSelectedExercise] = useState(null); // 수정/삭제할 대상

    // 폼 데이터 (등록/수정용)
    const [formData, setFormData] = useState({
        name: "",
        categoryId: "",
        unitType: "WEIGHT", // 기본값
    });

    const API_BASE = "https://fitlog.iubns.net/api";

    // --- API 헬퍼 함수 ---
    const getAuthHeader = () => {
        const token = localStorage.getItem("accessToken"); // 로그인 시 저장된 토큰 가져오기
        return token ? { Authorization: `Bearer ${token}` } : {};
    };

    const handleApiError = (err) => {
        alert("오류가 발생했습니다: " + err.message);
        console.error(err);
    };

    // --- 기능 구현 (CRUD) ---

    // R: 전체 불러오기
    const fetchExercises = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/admin/exercises`, {
                headers: { ...getAuthHeader() },
            });
            if (!res.ok) throw new Error("데이터를 불러오는데 실패했습니다. (관리자 권한 확인 필요)");
            const data = await res.json();
            setExercises(data);
        } catch (err) {
            handleApiError(err);
        } finally {
            setLoading(false);
        }
    };

    // C: 운동 등록
    const handleCreate = async () => {
        if (!formData.name || !formData.categoryId) return alert("빈칸을 채워주세요.");
        try {
            const res = await fetch(`${API_BASE}/admin/exercises`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...getAuthHeader(),
                },
                body: JSON.stringify({
                    name: formData.name,
                    categoryId: Number(formData.categoryId),
                    unitType: formData.unitType,
                }),
            });
            if (!res.ok) throw new Error("등록 실패");
            alert("운동이 등록되었습니다.");
            closeModal();
            fetchExercises(); // 목록 갱신
        } catch (err) {
            handleApiError(err);
        }
    };

    // U: 운동 수정
    const handleUpdate = async () => {
        if (!selectedExercise) return;
        try {
            const res = await fetch(
                `${API_BASE}/admin/exercises/${selectedExercise.exerciseId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        ...getAuthHeader(),
                    },
                    body: JSON.stringify({
                        name: formData.name,
                        categoryId: Number(formData.categoryId),
                        unitType: formData.unitType,
                    }),
                }
            );
            if (!res.ok) throw new Error("수정 실패");
            alert("수정되었습니다.");
            closeModal();
            fetchExercises();
        } catch (err) {
            handleApiError(err);
        }
    };

    // D: 운동 삭제
    const handleDelete = async () => {
        if (!selectedExercise) return;
        try {
            const res = await fetch(
                `${API_BASE}/admin/exercises/${selectedExercise.exerciseId}`,
                {
                    method: "DELETE",
                    headers: { ...getAuthHeader() },
                }
            );
            if (!res.ok) throw new Error("삭제 실패 (참조된 기록이 있을 수 있습니다)");
            alert("삭제되었습니다.");
            closeModal();
            fetchExercises();
        } catch (err) {
            handleApiError(err);
        }
    };

    // --- 모달 제어 함수 ---
    const openCreateModal = () => {
        setFormData({ name: "", categoryId: "", unitType: "WEIGHT" });
        setActiveModal("create");
    };

    const openEditModal = (ex) => {
        setSelectedExercise(ex);
        setFormData({
            name: ex.name,
            categoryId: ex.categoryId,
            unitType: ex.unitType,
        });
        setActiveModal("edit");
    };

    const openDeleteModal = (ex) => {
        setSelectedExercise(ex);
        setActiveModal("delete");
    };

    const closeModal = () => {
        setActiveModal(null);
        setSelectedExercise(null);
    };

    //  렌더링 시작 
    return (
        <div className="min-h-screen bg-gray-50 p-8 font-sans">
            <div className="max-w-6xl mx-auto bg-white shadow-lg border border-gray-200 rounded-lg overflow-hidden">

                {/* 헤더 */}
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-800">fitlog 관리자 페이지</h1>
                </div>

                {/* 메인 컨텐츠 */}
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-gray-700">DB 운동 목록</h2>
                        <div className="space-x-2">
                            <button
                                onClick={openCreateModal}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow transition"
                            >
                                + 신규 운동 등록
                            </button>
                            <button
                                onClick={fetchExercises}
                                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded shadow transition"
                            >
                                전체 불러오기
                            </button>
                        </div>
                    </div>

                    {/* 테이블 */}
                    <div className="overflow-x-auto border border-gray-200 rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200 text-sm text-center">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-4 py-3 font-semibold text-gray-600">exerciseId</th>
                                    <th className="px-4 py-3 font-semibold text-gray-600">name</th>
                                    <th className="px-4 py-3 font-semibold text-gray-600">unitType</th>
                                    <th className="px-4 py-3 font-semibold text-gray-600">categoryId</th>
                                    <th className="px-4 py-3 font-semibold text-gray-600">categoryName</th>
                                    <th className="px-4 py-3 font-semibold text-gray-600">관리</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {loading ? (
                                    <tr>
                                        <td colSpan="6" className="py-10 text-gray-500">
                                            데이터를 불러오는 중...
                                        </td>
                                    </tr>
                                ) : exercises.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="py-10 text-gray-400">
                                            데이터가 없습니다. &apos;전체 불러오기&apos;를 눌러보세요.
                                        </td>
                                    </tr>
                                ) : (
                                    exercises.map((ex) => (
                                        <tr key={ex.exerciseId} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-gray-500">{ex.exerciseId}</td>
                                            <td className="px-4 py-3 font-medium text-gray-800">{ex.name}</td>
                                            <td className="px-4 py-3 text-blue-600 bg-blue-50 rounded-full text-xs inline-block my-2 px-2 py-1">
                                                {ex.unitType}
                                            </td>
                                            <td className="px-4 py-3 text-gray-500">{ex.categoryId}</td>
                                            <td className="px-4 py-3 text-gray-500">{ex.categoryName}</td>
                                            <td className="px-4 py-3 space-x-2">
                                                <button
                                                    onClick={() => openEditModal(ex)}
                                                    className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100 text-gray-600 text-xs"
                                                >
                                                    수정
                                                </button>
                                                <button
                                                    onClick={() => openDeleteModal(ex)}
                                                    className="px-3 py-1 bg-white border border-red-200 rounded hover:bg-red-50 text-red-500 text-xs"
                                                >
                                                    삭제
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* --- 팝업 영역 --- */}
            {activeModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-2xl w-full max-w-md mx-4 overflow-hidden transform transition-all p-6">

                        {/* 운동 등록 팝업 */}
                        {activeModal === "create" && (
                            <>
                                <h3 className="text-xl font-bold mb-4 border-b pb-2">운동 등록</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            운동 이름 (name)
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                            placeholder="예: 벤치프레스"
                                            value={formData.name}
                                            onChange={(e) =>
                                                setFormData({ ...formData, name: e.target.value })
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            운동 카테고리 id (categoryId)
                                        </label>
                                        <input
                                            type="number"
                                            className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                            placeholder="숫자 입력 (예: 1)"
                                            value={formData.categoryId}
                                            onChange={(e) =>
                                                setFormData({ ...formData, categoryId: e.target.value })
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            운동 타입 (unitType)
                                        </label>
                                        <div className="flex space-x-2">
                                            {["WEIGHT", "REPS", "TIME"].map((type) => (
                                                <button
                                                    key={type}
                                                    onClick={() =>
                                                        setFormData({ ...formData, unitType: type })
                                                    }
                                                    className={`flex-1 py-2 text-sm border rounded ${
                                                        formData.unitType === type
                                                            ? "bg-blue-500 text-white border-blue-500"
                                                            : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                                                    }`}
                                                >
                                                    {type}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleCreate}
                                        className="w-full bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 rounded mt-2"
                                    >
                                        등록하기
                                    </button>
                                </div>
                            </>
                        )}

                        {/* 운동 수정 팝업 */}
                        {activeModal === "edit" && (
                            <>
                                <h3 className="text-xl font-bold mb-4 border-b pb-2">운동 수정</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            운동 이름 (name)
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                            value={formData.name}
                                            onChange={(e) =>
                                                setFormData({ ...formData, name: e.target.value })
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            운동 카테고리 id (categoryId)
                                        </label>
                                        <input
                                            type="number"
                                            className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                            value={formData.categoryId}
                                            onChange={(e) =>
                                                setFormData({ ...formData, categoryId: e.target.value })
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            운동 타입 (unitType)
                                        </label>
                                        <div className="flex space-x-2">
                                            {["WEIGHT", "REPS", "TIME"].map((type) => (
                                                <button
                                                    key={type}
                                                    onClick={() =>
                                                        setFormData({ ...formData, unitType: type })
                                                    }
                                                    className={`flex-1 py-2 text-sm border rounded ${
                                                        formData.unitType === type
                                                            ? "bg-blue-500 text-white border-blue-500"
                                                            : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                                                    }`}
                                                >
                                                    {type}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleUpdate}
                                        className="w-full bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 rounded mt-2"
                                    >
                                        수정하기
                                    </button>
                                </div>
                            </>
                        )}

                        {/* 운동 삭제 팝업 */}
                        {activeModal === "delete" && (
                            <>
                                <h3 className="text-xl font-bold mb-4 border-b pb-2">운동 삭제</h3>
                                <div className="text-center py-6">
                                    <p className="text-lg text-gray-800 font-medium mb-8">
                                        정말 삭제하시겠습니까?
                                    </p>
                                    <button
                                        onClick={handleDelete}
                                        className="w-full bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 rounded"
                                    >
                                        삭제
                                    </button>
                                </div>
                            </>
                        )}

                        {/* 닫기 버튼 */}
                        <button
                            onClick={closeModal}
                            className="mt-4 w-full text-center text-gray-500 text-sm hover:underline"
                        >
                            닫기
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
