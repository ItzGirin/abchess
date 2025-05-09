const board = Chess(); // Inisialisasi papan catur
const boardElement = ChessBoard('chessboard', {
    draggable: true,
    position: 'start',
    onDrop: handleMove,
    onSnapEnd: onSnapEnd,
});

function handleMove(source, target) {
    const move = board.move({
        from: source,
        to: target,
        promotion: 'q' // Promosi ke Ratu
    });

    if (move === null) return 'snapback'; // Jika langkah tidak sah

    updateBoard();
}

function onSnapEnd() {
    boardElement.position(board.fen());
}

function analyzePosition() {
    // Panggil API untuk menganalisis posisi
    fetch('/analyze', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fen: board.fen() }),
    })
    .then(response => response.json())
    .then(data => {
        alert(`Best Move: ${data.bestMove}`);
    });
}

function undoMove() {
    // Logika untuk membatalkan langkah
    // Anda perlu menyimpan langkah sebelumnya dalam stack
}

function redoMove() {
    // Logika untuk mengulangi langkah
}

function saveGame() {
    const fen = board.fen();
    const blob = new Blob([fen], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'game.fen';
    link.click();
}

function loadGame() {
    // Logika untuk memuat permainan dari file
}

function resetBoard() {
    board.reset();
    boardElement.position('start');
}

function flipBoard() {
    boardElement.flip();
}

// Inisialisasi papan saat halaman dimuat
window.onload = function() {
    boardElement.position('start');
};
