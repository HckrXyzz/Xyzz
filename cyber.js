 // Digital Clock
        function updateClock() {
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            document.getElementById('digital-clock').textContent = `${hours}:${minutes}:${seconds}`;
            
            const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
            document.getElementById('date-display').textContent = now.toLocaleDateString(undefined, options);
        }
        
        setInterval(updateClock, 1000);
        updateClock();
        
        // Tab Switching
        function switchTab(tabId) {
            // Hide all tabs
            document.querySelectorAll('.tab-content').forEach(tab => {
                tab.classList.add('hidden');
            });
            
            // Show the selected tab
            document.getElementById(tabId).classList.remove('hidden');
        }
        
        // Login System
        document.getElementById('login-btn').addEventListener('click', function() {
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            // Simple demo login (in a real system, this would be server-side)
            if (username === 'admin' && password === 'admin') {
                document.getElementById('login-modal').classList.add('hidden');
                
                // Add login activity
                const now = new Date();
                const timeString = `Today ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
                
                const newRow = document.createElement('tr');
                newRow.className = 'border-b border-green-900';
                newRow.innerHTML = `
                    <td class="py-2 px-3 text-sm">${username}</td>
                    <td class="py-2 px-3 text-sm"><span class="text-green-500">Login</span></td>
                    <td class="py-2 px-3 text-sm">${timeString}</td>
                    <td class="py-2 px-3 text-sm">192.168.1.${Math.floor(Math.random() * 255)}</td>
                `;
                
                const activityTable = document.getElementById('login-activity');
                activityTable.insertBefore(newRow, activityTable.firstChild);
            } else {
                document.getElementById('login-error').classList.remove('hidden');
                setTimeout(() => {
                    document.getElementById('login-error').classList.add('hidden');
                }, 3000);
            }
        });
        
        // Logout button
        document.getElementById('logout-btn').addEventListener('click', function() {
            document.getElementById('login-modal').classList.remove('hidden');
            
            // Add logout activity
            const now = new Date();
            const timeString = `Today ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
            
            const newRow = document.createElement('tr');
            newRow.className = 'border-b border-green-900';
            newRow.innerHTML = `
                <td class="py-2 px-3 text-sm">admin</td>
                <td class="py-2 px-3 text-sm"><span class="text-red-500">Logout</span></td>
                <td class="py-2 px-3 text-sm">${timeString}</td>
                <td class="py-2 px-3 text-sm">192.168.1.105</td>
            `;
            
            const activityTable = document.getElementById('login-activity');
            activityTable.insertBefore(newRow, activityTable.firstChild);
        });
        
        // Task Countdowns
        function updateCountdowns() {
            // Task 1: System Maintenance (24 hours from now)
            const deadline1 = new Date();
            deadline1.setHours(deadline1.getHours() + 24);
            updateCountdown('countdown-1', 'countdown-progress-1', deadline1);
            
            // Task 2: Security Audit (3 days from now)
            const deadline2 = new Date();
            deadline2.setDate(deadline2.getDate() + 3);
            updateCountdown('countdown-2', 'countdown-progress-2', deadline2);
        }
        
        function updateCountdown(elementId, progressId, deadline) {
            const now = new Date();
            const diff = deadline - now;
            
            if (diff <= 0) {
                document.getElementById(elementId).textContent = "00:00:00:00";
                document.getElementById(progressId).style.width = "0%";
                return;
            }
            
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            
            document.getElementById(elementId).textContent = 
                `${String(days).padStart(2, '0')}:${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
            
            // Calculate progress (assuming 7 days is 100%)
            const totalTime = 7 * 24 * 60 * 60 * 1000; // 7 days in ms
            const elapsed = totalTime - diff;
            const progress = Math.min(100, Math.max(0, (elapsed / totalTime) * 100));
            document.getElementById(progressId).style.width = `${progress}%`;
        }
        
        setInterval(updateCountdowns, 1000);
        updateCountdowns();
        
        // Animate chart bars on load
        document.addEventListener('DOMContentLoaded', function() {
            const chartBars = document.querySelectorAll('.chart-bar');
            chartBars.forEach(bar => {
                const originalHeight = bar.style.height;
                bar.style.height = '0%';
                setTimeout(() => {
                    bar.style.height = originalHeight;
                }, 300);
            });
        });
