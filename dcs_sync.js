/**
 * AeroBag Predictor - Lydia DCS Synchronization Module
 * Управление модальным окном предпросмотра и пакетным импортом рейсов
 */

(function() {
    'use strict';

    // Конфигурация доступных станций DCS
    const DCS_STATIONS = [
        { code: 'DYU', name: 'Душанбе (DYU)' },
        { code: 'NMA', name: 'Наманган (NMA)' },
        { code: 'TJU', name: 'Куляб (TJU)' },
        { code: 'SKD', name: 'Самарканд (SKD)' },
        { code: 'TAS', name: 'Ташкент (TAS)' },
        { code: 'CXR', name: 'Камрань (CXR)' },
        { code: 'IST', name: 'Стамбул (IST)' }
    ];

    let scannedFlights = [];
    let isScanning = false;

    // Инициализация при загрузке DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initDcsSyncUI);
    } else {
        initDcsSyncUI();
    }

    function initDcsSyncUI() {
        injectDcsModal();
    }

    // Создание HTML-разметки модального окна
    function injectDcsModal() {
        if (document.getElementById('dcsSyncModal')) return;

        const modalHtml = `
        <div id="dcsSyncModal" class="dcs-modal-overlay" style="display:none;">
            <div class="dcs-modal-container">
                <!-- Шапка модального окна -->
                <div class="dcs-modal-header">
                    <div class="dcs-header-title">
                        <span class="dcs-logo-icon">📡</span>
                        <div>
                            <h3>Синхронизация с Lydia DCS</h3>
                            <p>Автоматический сбор данных о пассажирах, багаже и ручной клади</p>
                        </div>
                    </div>
                    <button class="dcs-modal-close" onclick="window.closeDcsModal()">&times;</button>
                </div>

                <!-- Тело модального окна -->
                <div class="dcs-modal-body">
                    <!-- Панель параметров сканирования -->
                    <div class="dcs-filter-card">
                        <div class="dcs-filter-row">
                            <div class="dcs-filter-group">
                                <label>Дата начала</label>
                                <input type="date" id="dcsStartDate" class="dcs-input">
                            </div>
                            <div class="dcs-filter-group">
                                <label>Дата окончания</label>
                                <input type="date" id="dcsEndDate" class="dcs-input">
                            </div>
                            <div class="dcs-filter-group dcs-quick-dates">
                                <label>Быстрый выбор</label>
                                <div class="dcs-pill-group">
                                    <button type="button" class="dcs-pill" onclick="window.setDcsQuickDate('today')">Сегодня</button>
                                    <button type="button" class="dcs-pill active" onclick="window.setDcsQuickDate('yesterday')">Вчера и Сегодня</button>
                                    <button type="button" class="dcs-pill" onclick="window.setDcsQuickDate('3days')">3 дня</button>
                                </div>
                            </div>
                        </div>

                        <!-- Станции вылета -->
                        <div class="dcs-stations-section">
                            <div class="dcs-stations-header">
                                <label>Города вылета (Станции):</label>
                                <div class="dcs-stations-toggle">
                                    <a href="javascript:void(0)" onclick="window.toggleAllDcsStations(true)">Выбрать все</a> | 
                                    <a href="javascript:void(0)" onclick="window.toggleAllDcsStations(false)">Снять все</a>
                                </div>
                            </div>
                            <div class="dcs-stations-chips" id="dcsStationsContainer">
                                ${DCS_STATIONS.map(s => `
                                    <label class="dcs-chip">
                                        <input type="checkbox" name="dcs_station" value="${s.code}" checked>
                                        <span>${s.name}</span>
                                    </label>
                                `).join('')}
                            </div>
                        </div>

                        <!-- Чекбокс только Finalize и кнопка запуска -->
                        <div class="dcs-action-row">
                            <label class="dcs-checkbox-label">
                                <input type="checkbox" id="dcsOnlyFinalize" checked>
                                <span>Собирать только завершенные рейсы (статус <strong>Finalize</strong>)</span>
                            </label>

                            <button id="btnDcsStartScan" class="dcs-btn-scan" onclick="window.startDcsScan()">
                                <span class="dcs-btn-icon">🔍</span> Найти рейсы в Lydia DCS
                            </button>
                        </div>
                    </div>

                    <!-- Индикатор прогресса -->
                    <div id="dcsProgressBox" class="dcs-progress-box" style="display:none;">
                        <div class="dcs-spinner"></div>
                        <div class="dcs-progress-info">
                            <div class="dcs-progress-text-row">
                                <span id="dcsProgressText">Подключение к серверу Lydia DCS...</span>
                                <span id="dcsProgressPercent">0%</span>
                            </div>
                            <div class="dcs-progress-bar-wrap">
                                <div id="dcsProgressBar" class="dcs-progress-bar" style="width: 0%;"></div>
                            </div>
                        </div>
                    </div>

                    <!-- Таблица предварительного просмотра -->
                    <div id="dcsResultsSection" class="dcs-results-section" style="display:none;">
                        <div class="dcs-results-header">
                            <div class="dcs-results-count">
                                Найдено рейсов: <strong id="dcsFoundCount">0</strong> 
                                (<span id="dcsNewCount">0 новых</span>)
                            </div>
                            <div class="dcs-select-tools">
                                <button type="button" class="dcs-btn-mini" onclick="window.selectOnlyNewDcsFlights()">Выбрать только новые</button>
                                <button type="button" class="dcs-btn-mini" onclick="window.toggleAllDcsResults(true)">Выбрать все</button>
                                <button type="button" class="dcs-btn-mini" onclick="window.toggleAllDcsResults(false)">Снять все</button>
                            </div>
                        </div>

                        <div class="dcs-table-wrapper">
                            <table class="dcs-preview-table">
                                <thead>
                                    <tr>
                                        <th width="36"><input type="checkbox" id="dcsMasterCheck" onchange="window.toggleAllDcsResults(this.checked)"></th>
                                        <th>Дата</th>
                                        <th>Рейс</th>
                                        <th>Маршрут</th>
                                        <th>Пассажиры</th>
                                        <th>Взрослые</th>
                                        <th>Дети (РБ)</th>
                                        <th>Млад. (РМ)</th>
                                        <th>Багаж</th>
                                        <th>Р/Кладь</th>
                                        <th>Статус</th>
                                    </tr>
                                </thead>
                                <tbody id="dcsTableBody">
                                    <!-- Строки рендерятся динамически -->
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <!-- Подвал модального окна -->
                <div class="dcs-modal-footer">
                    <button class="dcs-btn-secondary" onclick="window.closeDcsModal()">Отмена</button>
                    <button id="btnDcsSaveSelected" class="dcs-btn-primary" style="display:none;" onclick="window.saveDcsSelectedFlights()">
                        💾 Загрузить выбранные рейсы в базу (<span id="dcsSelectedCount">0</span>)
                    </button>
                </div>
            </div>
        </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHtml);
        initModalDates();
    }

    function initModalDates() {
        setDcsQuickDate('yesterday');
    }

    window.openDcsModal = function() {
        const modal = document.getElementById('dcsSyncModal');
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    };

    window.closeDcsModal = function() {
        const modal = document.getElementById('dcsSyncModal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    };

    window.setDcsQuickDate = function(type) {
        const startInput = document.getElementById('dcsStartDate');
        const endInput = document.getElementById('dcsEndDate');
        if (!startInput || !endInput) return;

        const now = new Date();
        const formatDate = (d) => {
            const y = d.getFullYear();
            const m = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            return `${y}-${m}-${day}`;
        };

        const todayStr = formatDate(now);
        endInput.value = todayStr;

        if (type === 'today') {
            startInput.value = todayStr;
        } else if (type === 'yesterday') {
            const yDate = new Date(now);
            yDate.setDate(now.getDate() - 1);
            startInput.value = formatDate(yDate);
        } else if (type === '3days') {
            const d3Date = new Date(now);
            d3Date.setDate(now.getDate() - 3);
            startInput.value = formatDate(d3Date);
        }

        // Подсветка кнопок
        document.querySelectorAll('.dcs-pill').forEach(btn => btn.classList.remove('active'));
        if (event && event.target && event.target.classList.contains('dcs-pill')) {
            event.target.classList.add('active');
        }
    };

    window.toggleAllDcsStations = function(checked) {
        document.querySelectorAll('#dcsStationsContainer input[type="checkbox"]').forEach(cb => {
            cb.checked = checked;
        });
    };

    window.startDcsScan = async function() {
        if (isScanning) return;

        const startVal = document.getElementById('dcsStartDate').value;
        const endVal = document.getElementById('dcsEndDate').value;
        if (!startVal || !endVal) {
            alert('Пожалуйста, укажите даты диапазона сканирования.');
            return;
        }

        // Конвертируем YYYY-MM-DD в DD/MM/YYYY
        const convertDate = (val) => {
            const [y, m, d] = val.split('-');
            return `${d}/${m}/${y}`;
        };

        const startDateDcs = convertDate(startVal);
        const endDateDcs = convertDate(endVal);

        const checkedStations = Array.from(document.querySelectorAll('#dcsStationsContainer input[type="checkbox"]:checked')).map(cb => cb.value);
        if (checkedStations.length === 0) {
            alert('Выберите хотя бы один город вылета.');
            return;
        }

        const onlyFinalize = document.getElementById('dcsOnlyFinalize').checked;

        // UI в состояние сканирования
        isScanning = true;
        document.getElementById('btnDcsStartScan').disabled = true;
        document.getElementById('dcsProgressBox').style.display = 'flex';
        document.getElementById('dcsResultsSection').style.display = 'none';
        document.getElementById('btnDcsSaveSelected').style.display = 'none';

        const updateProgress = (text, pct) => {
            const safePct = Math.min(100, Math.max(0, Math.round(pct)));
            const elText = document.getElementById('dcsProgressText');
            const elPct = document.getElementById('dcsProgressPercent');
            const elBar = document.getElementById('dcsProgressBar');
            if (elText) elText.innerText = text;
            if (elPct) elPct.innerText = `${safePct}%`;
            if (elBar) elBar.style.width = `${safePct}%`;
        };

        const stationNames = {
            'DYU': 'Душанбе (DYU)',
            'NMA': 'Наманган (NMA)',
            'TJU': 'Куляб (TJU)',
            'SKD': 'Самарканд (SKD)',
            'TAS': 'Ташкент (TAS)',
            'CXR': 'Камрань (CXR)',
            'IST': 'Стамбул (IST)'
        };

        updateProgress('Авторизация в Lydia DCS...', 5);
        scannedFlights = [];

        try {
            // Определяем эндпоинт (локальный Python сервер или PHP на хостинге)
            const endpoint = (window.location.port === '8080' || window.location.protocol === 'file:') 
                ? 'http://localhost:8080/api/dcs_sync?action=scan_flights' 
                : 'lydia_dcs_sync.php?action=scan_flights';

            const totalStations = checkedStations.length;
            const seenIds = new Set();

            for (let i = 0; i < totalStations; i++) {
                const locCode = checkedStations[i];
                const locName = stationNames[locCode] || locCode;
                const startPct = Math.round(5 + (i / totalStations) * 90);

                updateProgress(`[${i + 1}/${totalStations}] ${locName}... (Найдено: ${scannedFlights.length})`, startPct);

                try {
                    const resp = await fetch(endpoint, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            start_date: startDateDcs,
                            end_date: endDateDcs,
                            locations: [locCode],
                            only_finalized: onlyFinalize
                        })
                    });

                    const data = await resp.json();
                    if (data && data.success && Array.isArray(data.flights)) {
                        for (const flt of data.flights) {
                            if (!seenIds.has(flt.id)) {
                                seenIds.add(flt.id);
                                scannedFlights.push(flt);
                            }
                        }
                    }
                } catch (locErr) {
                    console.warn(`Error scanning station ${locCode}:`, locErr);
                }

                const endPct = Math.round(5 + ((i + 1) / totalStations) * 90);
                updateProgress(`[${i + 1}/${totalStations}] ${locName} (Найдено: ${scannedFlights.length})`, endPct);
            }

            updateProgress(`Сбор завершен! Всего найдено рейсов: ${scannedFlights.length}`, 100);
            await new Promise(r => setTimeout(r, 450));

            renderDcsTable(scannedFlights);

        } catch (err) {
            console.error('DCS Scan Error:', err);
            alert('Ошибка связи с сервером DCS: ' + err.message);
        } finally {
            isScanning = false;
            document.getElementById('btnDcsStartScan').disabled = false;
            document.getElementById('dcsProgressBox').style.display = 'none';
        }
    };

    function renderDcsTable(flights) {
        const tbody = document.getElementById('dcsTableBody');
        tbody.innerHTML = '';

        if (flights.length === 0) {
            tbody.innerHTML = `<tr><td colspan="12" style="text-align:center; padding: 24px; color: #a0aec0;">Рейсов со статусом Finalize за выбранный период не найдено.</td></tr>`;
            document.getElementById('dcsResultsSection').style.display = 'block';
            document.getElementById('dcsFoundCount').innerText = '0';
            document.getElementById('dcsNewCount').innerText = '0 новых';
            return;
        }

        let newCount = 0;

        flights.forEach((flt, idx) => {
            const isNew = !flt.already_in_db;
            if (isNew) newCount++;

            const tr = document.createElement('tr');
            tr.className = isNew ? 'dcs-row-new' : 'dcs-row-existing';

            tr.innerHTML = `
                <td>
                    <input type="checkbox" class="dcs-flight-cb" data-idx="${idx}" ${isNew ? 'checked' : ''} onchange="window.updateDcsSelectedCount()">
                </td>
                <td><strong>${flt.flight_date}</strong></td>
                <td><span class="dcs-flt-badge">${flt.flight_no}</span></td>
                <td><strong>${flt.route}</strong></td>
                <td><strong>${flt.pax}</strong></td>
                <td>${flt.vz} <small style="color:#94a3b8;">(${flt.men}м / ${flt.women}ж)</small></td>
                <td>${flt.rb}</td>
                <td>${flt.rm}</td>
                <td><strong>${flt.bag_pcs}</strong> шт / <strong>${flt.bag_weight}</strong> кг</td>
                <td>${flt.hb_weight} кг</td>
                <td>
                    ${isNew 
                        ? '<span class="dcs-status-tag new">🟢 Новый</span>' 
                        : '<span class="dcs-status-tag exist">🟡 В базе</span>'
                    }
                </td>
            `;
            tbody.appendChild(tr);
        });

        document.getElementById('dcsFoundCount').innerText = flights.length;
        document.getElementById('dcsNewCount').innerText = `${newCount} новых`;
        document.getElementById('dcsResultsSection').style.display = 'block';
        document.getElementById('btnDcsSaveSelected').style.display = 'inline-flex';

        updateDcsSelectedCount();
    }

    window.updateDcsSelectedCount = function() {
        const checked = document.querySelectorAll('.dcs-flight-cb:checked');
        const btnSave = document.getElementById('btnDcsSaveSelected');
        const countSpan = document.getElementById('dcsSelectedCount');
        
        countSpan.innerText = checked.length;
        btnSave.disabled = (checked.length === 0);
    };

    window.toggleAllDcsResults = function(checked) {
        document.querySelectorAll('.dcs-flight-cb').forEach(cb => {
            cb.checked = checked;
        });
        updateDcsSelectedCount();
    };

    window.selectOnlyNewDcsFlights = function() {
        document.querySelectorAll('.dcs-flight-cb').forEach(cb => {
            const idx = parseInt(cb.dataset.idx, 10);
            const flt = scannedFlights[idx];
            cb.checked = flt && !flt.already_in_db;
        });
        updateDcsSelectedCount();
    };

    window.saveDcsSelectedFlights = async function() {
        const checkedBoxes = Array.from(document.querySelectorAll('.dcs-flight-cb:checked'));
        if (checkedBoxes.length === 0) {
            alert('Выберите хотя бы один рейс для загрузки.');
            return;
        }

        const selectedFlights = checkedBoxes.map(cb => scannedFlights[parseInt(cb.dataset.idx, 10)]);

        const btnSave = document.getElementById('btnDcsSaveSelected');
        btnSave.disabled = true;
        btnSave.innerHTML = `⏳ Сохранение ${selectedFlights.length} рейсов...`;

        try {
            const endpoint = (window.location.port === '8080' || window.location.protocol === 'file:') 
                ? 'http://localhost:8080/api/dcs_sync?action=save_to_database' 
                : 'lydia_dcs_sync.php?action=save_to_database';

            const resp = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ flights: selectedFlights })
            });

            const data = await resp.json();

            if (data.success) {
                // Мгновенно обновляем базу в оперативной памяти AeroBag
                if (typeof window.userFlights !== 'undefined' && Array.isArray(window.userFlights)) {
                    selectedFlights.forEach(flt => {
                        const item = {
                            id: flt.id || ('dcs_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5)),
                            airline: flt.airline || 'N4',
                            flight_no: flt.flight_no,
                            date: flt.flight_date,
                            from: flt.departure_code,
                            to: flt.dest_code,
                            men: flt.vz || (flt.men + flt.women),
                            women: 0,
                            rb: flt.rb || 0,
                            rm: flt.rm || 0,
                            pax: flt.pax || ((flt.vz || 0) + (flt.rb || 0)),
                            bag_pcs: flt.bag_pcs || 0,
                            bag_weight: flt.bag_weight || 0,
                            hb_weight: flt.hb_weight || 0,
                            source: 'Lydia DCS',
                            active: true
                        };

                        const exIdx = window.userFlights.findIndex(u => 
                            String(u.flight_no).replace(/\D/g,'') === String(item.flight_no).replace(/\D/g,'') && 
                            u.date === item.date && 
                            u.from === item.from && 
                            u.to === item.to
                        );

                        if (exIdx !== -1) {
                            window.userFlights[exIdx] = Object.assign({}, window.userFlights[exIdx], item);
                        } else {
                            window.userFlights.push(item);
                        }
                    });

                    if (typeof window.saveUserFlights === 'function') window.saveUserFlights();
                    if (typeof window.populateAirportDropdowns === 'function') window.populateAirportDropdowns();
                    if (typeof window.updateActiveDateRangeAndCounts === 'function') window.updateActiveDateRangeAndCounts();
                    if (typeof window.renderFlightsTable === 'function') window.renderFlightsTable();
                    if (typeof window.renderUploadedFilesList === 'function') window.renderUploadedFilesList();
                    if (typeof window.populateAllFlightsDropdown === 'function') window.populateAllFlightsDropdown();
                }

                alert(`✅ ${data.message || 'Рейсы успешно импортированы в базу!'}`);
                closeDcsModal();
            } else {
                alert('Ошибка сохранения рейсов: ' + (data.error || 'Неизвестная ошибка'));
            }

        } catch (err) {
            console.error('Save DCS error:', err);
            alert('Ошибка отправки рейсов в базу: ' + err.message);
        } finally {
            btnSave.disabled = false;
            btnSave.innerHTML = `💾 Загрузить выбранные рейсы в базу (<span id="dcsSelectedCount">${checkedBoxes.length}</span>)`;
        }
    };

})();
