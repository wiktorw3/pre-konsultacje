import React from 'react';
import Timeline from './Timeline';

/**
 * Przykładowe dane dla komponentu Timeline
 * Format danych:
 * {
 *   stage: string - nazwa etapu (musi odpowiadać jednemu z etapów w kolejności)
 *   status: 'preparing' | 'consultations' | 'passed' | 'risks'
 *   description: string - krótki opis etapu
 *   link: string - URL do dokumentów (opcjonalne)
 *   projectName: string - nazwa projektu (opcjonalne, dla modala)
 *   ministry: string - nazwa ministerstwa (opcjonalne, dla modala)
 *   osrSummary: string - skrót OSR w prostym języku (opcjonalne, dla modala)
 * }
 */

const exampleTimelineData = [
  {
    stage: 'Prekonsultacje',
    status: 'passed',
    description: 'Etap wstępnych konsultacji społecznych i analiz.',
    link: 'https://www.gov.pl/web/prekonsultacje',
    projectName: 'Ustawa o wspieraniu innowacyjności',
    ministry: 'Ministerstwo Rozwoju i Technologii',
    osrSummary: 'Wstępny etap przygotowywania projektu ustawy. Każdy może zgłaszać pomysły i opinie, aby sprawdzić możliwe skutki zmian.'
  },
  {
    stage: 'Projekt',
    status: 'passed',
    description: 'Przygotowanie projektu ustawy przez ministerstwo.',
    link: 'https://www.gov.pl/web/dziennik-ustaw',
    projectName: 'Ustawa o wspieraniu innowacyjności',
    ministry: 'Ministerstwo Rozwoju i Technologii',
    osrSummary: 'Tworzony jest oficjalny projekt ustawy. Zawiera treść przepisów, cele i uzasadnienie dla zmian.'
  },
  {
    stage: 'Konsultacje',
    status: 'consultations',
    description: 'Publiczne konsultacje projektu ustawy - możliwość składania uwag.',
    link: 'https://www.gov.pl/web/konsultacje-spoleczne',
    projectName: 'Ustawa o wspieraniu innowacyjności',
    ministry: 'Ministerstwo Rozwoju i Technologii',
    osrSummary: 'Projekt ustawy jest udostępniany głównym interesariuszom – organizacjom, instytucjom i grupom, które są najbardziej związane z tematem ustawy. Mogą zgłaszać uwagi i sugestie zmian.'
  },
  {
    stage: 'Ustawa',
    status: 'consultations',
    description: 'Projekt ustawy przekazany do dalszych prac legislacyjnych.',
    link: 'https://www.sejm.gov.pl',
    projectName: 'Ustawa o wspieraniu innowacyjności',
    ministry: 'Ministerstwo Rozwoju i Technologii',
    osrSummary: 'Projekt zostaje przyjęty przez rząd i oficjalnie skierowany do Sejmu jako projekt ustawy.'
  },
  {
    stage: 'Głosowanie w Sejmie',
    status: 'preparing',
    description: 'Projekt ustawy w trakcie procedowania w Sejmie RP.',
    link: 'https://www.sejm.gov.pl/Sejm9.nsf/agent.xsp?symbol=posglosowania',
    projectName: 'Ustawa o wspieraniu innowacyjności',
    ministry: 'Ministerstwo Rozwoju i Technologii',
    osrSummary: 'Posłowie głosują nad projektem ustawy. Jeśli większość posłów go popiera, ustawa przechodzi do Senatu.'
  },
  {
    stage: 'Głosowanie w Senacie',
    status: 'preparing',
    description: 'Ustawa po uchwaleniu przez Sejm trafia do Senatu.',
    link: 'https://www.senat.gov.pl',
    projectName: 'Ustawa o wspieraniu innowacyjności',
    ministry: 'Ministerstwo Rozwoju i Technologii',
    osrSummary: 'Senat może zaakceptować ustawę w całości, wprowadzić poprawki lub zgłosić uwagi. Poprawki Senatu wracają do Sejmu do ostatecznego rozpatrzenia.'
  },
  {
    stage: 'Decyzja Prezydenta',
    status: 'risks',
    description: 'Ostatni etap - Prezydent podpisuje ustawę lub ją zawetuje.',
    link: 'https://www.prezydent.pl',
    projectName: 'Ustawa o wspieraniu innowacyjności',
    ministry: 'Ministerstwo Rozwoju i Technologii',
    osrSummary: 'Prezydent może: Podpisać ustawę, wtedy wchodzi w życie. Zawetować ustawę, wtedy wraca do Sejmu, który może odrzucić weto większością 3/5 głosów w obecności co najmniej połowy posłów. Zwrócić ustawę do Trybunału Konstytucyjnego w sprawie zgodności z konstytucją.'
  }
];

/**
 * Przykładowy komponent użycia Timeline
 */
const TimelineExample = () => {
  const handleStageClick = (stage) => {
    // Opcjonalna funkcja callback - można użyć do logowania, analityki itp.
    console.log('Kliknięto etap:', stage.stage);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '2rem', fontSize: '2rem', fontWeight: '700' }}>
        Oś czasu procesu legislacji
      </h1>
      <Timeline data={exampleTimelineData} onStageClick={handleStageClick} />
    </div>
  );
};

export default TimelineExample;

/**
 * Przykładowe dane z różnymi statusami dla testów:
 */

export const exampleDataMinimal = [
  {
    stage: 'Prekonsultacje',
    status: 'preparing',
    description: 'Etap w przygotowaniu.'
  },
  {
    stage: 'Projekt',
    status: 'consultations',
    description: 'Projekt w konsultacjach.'
  },
  {
    stage: 'Konsultacje',
    status: 'passed',
    description: 'Konsultacje zakończone.'
  },
  {
    stage: 'Ustawa',
    status: 'risks',
    description: 'Ryzyka wdrożeniowe.'
  }
];

export { exampleTimelineData };

