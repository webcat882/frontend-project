const simpleGit = require('simple-git');
const git = simpleGit();
const { execSync } = require('child_process');

const startDate = new Date('2016-11-18');
const endDate = new Date('2017-2-12');

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function isWeekend(date) {
    const day = date.getDay();
    return day === 0 || day === 6;
}

function getRandomWeekdays(startDate, endDate) {
    const dates = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
        const weekdays = [];
        for (let i = 0; i < 7; i++) {
            if (!isWeekend(currentDate)) {
                weekdays.push(new Date(currentDate));
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }

        // Choose 1-2 random weekdays from the current week
        const commitsThisWeek = getRandomInt(5, 5);
        for (let i = 0; i < commitsThisWeek; i++) {
            const randomWeekday = weekdays[getRandomInt(0, weekdays.length - 1)];
            dates.push(randomWeekday);
        }
    }

    return dates.sort((a, b) => a - b);
}

const commitDates = getRandomWeekdays(startDate, endDate);

async function createFakeHistory() {
    for (const date of commitDates) {
        const commitCount = getRandomInt(3, 5); // Number of commits for this day
        for (let i = 0; i < commitCount; i++) {
            const formattedDate = date.toISOString();
            execSync(`echo "Fake commit on ${formattedDate} #${i + 1}" > fakefile.txt`);
            await git.add('./*');
            await git.commit(`Fake commit on ${formattedDate} #${i + 1}`, { '--date': formattedDate });
        }
        // Move to the next day
        date.setDate(date.getDate() + 1);
    }
}

createFakeHistory().then(() => console.log('Fake history created successfully!'));
